import pytest
from app.analyzer import DistilBertAnalyzer

class MockPipeline:
    def __init__(self, label, score):
        self.label = label
        self.score = score
        
    def __call__(self, text):
        return [{'label': self.label, 'score': self.score}]

def test_happy_path_positive():
    pipeline = MockPipeline("POSITIVE", 0.90)
    analyzer = DistilBertAnalyzer(pipeline)
    res = analyzer.analyze("I love this!")
    assert res.sentiment == "positive"
    assert res.confidence == 0.90

def test_stressed_text():
    pipeline = MockPipeline("NEGATIVE", 0.70)
    analyzer = DistilBertAnalyzer(pipeline)
    res = analyzer.analyze("I am so overwhelmed with this deadline.")
    assert res.sentiment == "stressed"

def test_frustrated_text():
    pipeline = MockPipeline("NEGATIVE", 0.70)
    analyzer = DistilBertAnalyzer(pipeline)
    res = analyzer.analyze("This is pointless and annoying.")
    assert res.sentiment == "frustrated"
    
def test_negative_text():
    pipeline = MockPipeline("NEGATIVE", 0.85)
    analyzer = DistilBertAnalyzer(pipeline)
    res = analyzer.analyze("I do not like this.")
    assert res.sentiment == "negative"

def test_low_confidence_neutral():
    pipeline = MockPipeline("NEGATIVE", 0.50)
    analyzer = DistilBertAnalyzer(pipeline)
    res = analyzer.analyze("I don't know")
    assert res.sentiment == "neutral"
    
def test_empty_text():
    analyzer = DistilBertAnalyzer(None)
    res = analyzer.analyze("   ")
    assert res.sentiment == "neutral"
    assert res.confidence == 0.5
