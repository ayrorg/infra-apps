import * as k8s from '@pulumi/kubernetes';
import { apiDomain } from './config';
import * as api from './deployment';
import { namespace } from './namespace';

const name = 'billing-api';

export const ingress = new k8s.networking.v1.Ingress(`${name}-ingress`, {
  metadata: {
    name: 'api',
    namespace: namespace.metadata.name,
    annotations: {
      'kubernetes.io/ingress.class': 'caddy',
    },
  },
  spec: {
    rules: [
      {
        host: apiDomain,
        http: {
          paths: [
            {
              path: '/',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: api.service.metadata.name,
                  port: { number: api.port },
                },
              },
            },
          ],
        },
      },
    ],
  },
});
