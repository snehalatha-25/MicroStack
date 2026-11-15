
pipeline {
    agent any

    environment {
        JAVA_HOME = 'C:\\Program Files\\Java\\jdk-21.0.12.1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Product') {
            steps {
                dir('backend/product-service') {
                    bat '"C:\\Program Files\\apache-maven-3.10.0\\bin\\mvn.cmd" -B test package'
                }
            }
        }

        stage('Build Cart') {
            steps {
                dir('backend/cart-service') {
                    bat '"C:\\Program Files\\apache-maven-3.10.0\\bin\\mvn.cmd" -B test package'
                }
            }
        }

        stage('Build Order') {
            steps {
                dir('backend/order-service') {
                    bat '"C:\\Program Files\\apache-maven-3.10.0\\bin\\mvn.cmd" -B test package'
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
