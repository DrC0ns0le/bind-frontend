pipeline {
    agent {
        kubernetes {
            yamlFile 'buildkit-builder.yml'
        }
    }

    environment {
        DOCKER_REGISTRY = "registry.internal.leejacksonz.com"
        DOCKER_IMAGE = "bind-frontend"
        GIT_BRANCH_NAME = "${env.GIT_BRANCH.replaceAll('^origin/', '')}"
        DOCKER_TAG = "${GIT_BRANCH_NAME.replaceAll('/', '-')}-${env.GIT_COMMIT.take(7)}"

        // Multi-architecture platforms
        BUILD_PLATFORMS = "linux/amd64,linux/arm64"

        // Registry credentials (for future use)
        REGISTRY_CREDENTIALS_ID = "docker-registry-credentials"

        // Frontend build-time environment variables
        // Any VITE_* variables defined here will be automatically injected into .env.production
        // Example (uncomment to use):
        // VITE_API_URL = "your-api-url"
        // VITE_OAUTH_CLIENT_ID = "your-client-id"
    }

    stages {
        stage('Configure Build Environment') {
            steps {
                container('buildkit') {
                    script {
                        echo "📝 Scanning Jenkins environment for VITE_* variables..."

                        // Dynamically scan and apply all VITE_* environment variables
                        sh '''
                            # Function to set or update env var in .env.production
                            set_env() {
                                key=$1
                                value=$2

                                if grep -q "^${key}=" .env.production 2>/dev/null; then
                                    # Override existing value
                                    sed -i "s|^${key}=.*|${key}=${value}|" .env.production
                                    echo "  ✓ Updated: ${key}"
                                else
                                    # Add new value
                                    echo "${key}=${value}" >> .env.production
                                    echo "  ✓ Added: ${key}"
                                fi
                            }

                            # Scan environment for all VITE_* variables and apply them
                            env | grep '^VITE_' | while IFS='=' read -r key value; do
                                set_env "$key" "$value"
                            done
                        '''

                        echo "✅ Build environment configured"

                        // Show final .env.production
                        sh '''
                            echo "📋 Final .env.production:"
                            grep "^VITE_" .env.production || echo "  (no VITE_* variables found)"
                        '''
                    }
                }
            }
        }

        stage('Setup Registry Auth') {
            steps {
                container('buildkit') {
                    script {
                        // Try to setup auth if credentials exist, otherwise skip
                        try {
                            withCredentials([usernamePassword(
                                credentialsId: env.REGISTRY_CREDENTIALS_ID,
                                usernameVariable: 'REGISTRY_USER',
                                passwordVariable: 'REGISTRY_PASSWORD'
                            )]) {
                                echo "🔐 Registry credentials found, setting up authentication..."
                                sh '''
                                    mkdir -p ~/.docker
                                    cat > ~/.docker/config.json <<EOF
{
  "auths": {
    "${DOCKER_REGISTRY}": {
      "auth": "$(echo -n ${REGISTRY_USER}:${REGISTRY_PASSWORD} | base64)"
    }
  }
}
EOF
                                '''
                                echo "✅ Authentication configured"
                            }
                        } catch (Exception e) {
                            echo "ℹ️  No registry credentials found (credential ID: ${env.REGISTRY_CREDENTIALS_ID})"
                            echo "ℹ️  Proceeding without authentication (registry must allow anonymous push)"
                        }
                    }
                }
            }
        }

        stage('Build and Push Multi-Arch Image') {
            steps {
                container('buildkit') {
                    script {
                        // Build tag list
                        def tagList = "${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"

                        // Add latest tag for main/master branches
                        if (GIT_BRANCH_NAME == 'main' || GIT_BRANCH_NAME == 'master') {
                            tagList += ",${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                        }

                        echo "Building multi-arch image (${BUILD_PLATFORMS}):"
                        tagList.split(',').each { tag ->
                            echo "  - ${tag}"
                        }

                        // Build and push using buildctl-daemonless.sh
                        sh """
                            buildctl-daemonless.sh build \\
                                --frontend dockerfile.v0 \\
                                --local context=. \\
                                --local dockerfile=. \\
                                --opt platform=${BUILD_PLATFORMS} \\
                                --opt filename=Dockerfile \\
                                --output type=image,\\"name=${tagList}\\",push=true
                        """

                        echo "✅ Successfully built and pushed multi-arch images"
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                echo "✅ Build completed successfully!"
                echo "Images available at:"
                echo "  ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                if (GIT_BRANCH_NAME == 'main' || GIT_BRANCH_NAME == 'master') {
                    echo "  ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                }
                echo "Architectures: ${BUILD_PLATFORMS}"
            }
        }
        failure {
            echo "❌ Build failed. Check BuildKit logs above."
        }
        always {
            script {
                // Clean up credentials if they were created
                try {
                    container('buildkit') {
                        sh 'rm -f ~/.docker/config.json'
                    }
                } catch (Exception e) {
                    echo "ℹ️  Skipping credential cleanup (container not available)"
                }

                // Clean workspace
                try {
                    cleanWs()
                } catch (Exception e) {
                    echo "ℹ️  Skipping workspace cleanup (workspace not available)"
                }
            }
        }
    }
}
