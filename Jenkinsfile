pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build Product') { steps { dir('backend/product-service') { sh 'mvn -B test package' } } }
    stage('Build Cart') { steps { dir('backend/cart-service') { sh 'mvn -B test package' } } }
    stage('Build Order') { steps { dir('backend/order-service') { sh 'mvn -B test package' } } }
    stage('Build Frontend') { steps { dir('frontend') { sh 'npm ci && npm run build' } } }
  }
  post { always { echo 'MicroStack pipeline finished.' } }
}
