import * as k8s from '@pulumi/kubernetes';
import { namespace } from './namespace';

new k8s.apiextensions.CustomResource('billing-api-db-cluster', {
  kind: 'postgresql',
  apiVersion: 'acid.zalan.do/v1',
  metadata: {
    name: 'acid-billing-db',
    namespace: namespace.metadata.name,
    labels: {
      team: 'acid',
    },
  },
  spec: {
    teamId: 'acid',
    postgresql: {
      version: '14',
    },
    numberOfInstances: 1,
    volume: {
      size: '10Gi',
    },
    users: {
      billing: [],
    },
    databases: {
      billing: 'billing',
    },
    allowedSourceRanges: null,
    resources: {
      requests: {
        cpu: '100m',
        memory: '100Mi',
      },
      limits: {
        cpu: '500m',
        memory: '500Mi',
      },
    },
  },
});
