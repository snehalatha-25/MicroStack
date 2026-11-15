
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Product') {
            steps {
                dir('backend/product-service') {
                    bat 'mvn -B test package'
                }
            }
        }

        stage('Build Cart') {
            steps {
                dir('backend/cart-service') {
                    bat 'mvn -B test package'
                }
            }
        }

        stage('Build Order') {
            steps {
                dir('backend/order-service') {
                    bat 'mvn -B test package'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm ci && npm run build'
                }
            }
        }
    }

    post {
        always {
            echo 'MicroStack pipeline finished.'
        }
    }
}
