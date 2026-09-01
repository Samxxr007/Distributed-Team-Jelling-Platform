pipeline {
    agent any
    environment {
        KUBECONFIG = credentials('kubeconfig')
        NAMESPACE = 'jelling'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Pull Images') {
            steps {
                sh 'docker pull ghcr.io/your-org/jelling-frontend:latest'
                sh 'docker pull ghcr.io/your-org/jelling-backend:latest'
                sh 'docker pull ghcr.io/your-org/jelling-sentiment:latest'
            }
        }
        stage('Validate K8s') {
            steps {
                sh 'kubectl apply --dry-run=client -f k8s/'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/ -n $NAMESPACE'
            }
        }
        stage('Rollout Status') {
            steps {
                sh 'kubectl rollout status deploy/backend -n $NAMESPACE'
                sh 'kubectl rollout status deploy/frontend -n $NAMESPACE'
                sh 'kubectl rollout status deploy/sentiment-service -n $NAMESPACE'
            }
        }
        stage('Health Check') {
            steps {
                retry(5) {
                    sh 'curl -s http://jelling.local/api/health | grep OK'
                }
            }
        }
        stage('Smoke Test') {
            steps {
                sh 'curl -s -o /dev/null -w "%{http_code}" http://jelling.local/api/auth/me | grep 401'
            }
        }
    }
    post {
        failure {
            sh 'kubectl rollout undo deployment/backend -n $NAMESPACE'
            sh 'kubectl rollout undo deployment/frontend -n $NAMESPACE'
            sh 'kubectl rollout undo deployment/sentiment-service -n $NAMESPACE'
        }
        success {
            echo 'Deployment successful'
        }
    }
}
