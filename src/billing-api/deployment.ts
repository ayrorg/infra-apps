import * as k8s from '@pulumi/kubernetes';
import { image, logLevel, tag } from './config';
import { namespace } from './namespace';

const name = 'billing-api';

export const port = 80;

const deployment = new k8s.apps.v1.Deployment(`${name}-deployment`, {
  metadata: {
    name: 'api',
    namespace: namespace.metadata.name,
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        app: 'api',
      },
    },
    template: {
      metadata: {
        labels: {
          app: 'api',
        },
      },
      spec: {
        volumes: [
          {
            name: 'db-secrets',
            secret: {
              defaultMode: 420,
              secretName:
                'billing.acid-billing-db.credentials.postgresql.acid.zalan.do',
            },
          },
        ],
        containers: [
          {
            name: 'api',
            image: `${image}:${tag}`,
            imagePullPolicy: 'IfNotPresent',
            ports: [{ containerPort: port }],
            env: [
              {
                name: 'PORT',
                value: String(port),
              },
              {
                name: 'LOG_LEVEL',
                value: logLevel,
              },
              {
                name: 'DSN',
                value:
                  'postgres://acid-billing-db-pooler:5432/billing',
              },
              {
                name: 'DATA_SOURCE_USER_FILE',
                value: '/run/secrets/db-secrets/username',
              },
              {
                name: 'DATA_SOURCE_PASS_FILE',
                value: '/run/secrets/db-secrets/password',
              },
            ],
            volumeMounts: [
              {
                mountPath: '/run/secrets/db-secrets',
                name: 'db-secrets',
              },
            ],
          },
        ],
      },
    },
  },
});

export const service = new k8s.core.v1.Service(`${name}-api`, {
  metadata: {
    name: 'api',
    namespace: namespace.metadata.name,
  },
  spec: {
    ports: [{ port }],
    selector: deployment.spec.selector.matchLabels,
  },
});
