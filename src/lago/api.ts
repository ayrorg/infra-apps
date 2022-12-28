import * as k8s from '@pulumi/kubernetes';
import { interpolate } from '@pulumi/pulumi';
import { apiDomain, frontendDomain, tag } from './config';
import { namespace } from './namespace';
import {
  databaseName,
  databasePassword,
  service as databaseService,
  databaseUser,
} from './postgres';
import { service as redisService } from './redis';

const name = 'lago';

// TODO: Replace database with postgres cluster instead
const databaseHost = interpolate`${databaseService.metadata.name}.${databaseService.metadata.namespace}`;
const databaseUrl = interpolate`postgresql://${databaseUser}:${databasePassword}@${databaseHost}:5432/${databaseName}`;

const redisHost = interpolate`${redisService.metadata.name}.${redisService.metadata.namespace}`;
const redisUrl = interpolate`redis://${redisHost}:6379`;

// TODO: Replace "secrets" below
const secretKeyBase = 'your-secret-key-base-hex-64';
const rsaPrivateKey =
  'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcFFJQkFBS0NBUUVBeUszWHBWUEZNelVEbTFOaXVrN2FmWjFzMXIvY3E2MlJkWk1NT3BITVNlVFhjTmN4CkMwU0V6L2dYeXZOVUxDQlNpOEFjQ1N2YmVoaEVvT25xQmZNcW1oUTlwK3pscEJzNm5IYzEyNGMzTk9JK1hkZzkKS2Y0Sk91K1ZCRWMvNnJyTkljV0Y4NWhaYjdXUVB2c3BKejc1RlBIWFFUbFBVckhrOVI3bWU0UjlVeXR5YUdnQwpqY0IxdmN4M29IK3Mvb2lmZTh5blRQK0wzSU9UNXFmZE9qVGNnQzN0WTRVZ0VXcUVTNXZHTk1ZZmRUQW4vQ2xGCk9waGJpWC8wUHhhbDJITTdkS3BmS2R1OTVIK3RySDliZHhDUjlZZyszVnE1eEp6YnRXVGY1aFd0b01yZGpFeW4KTXpjQlpHRjZBMmxoRkJJWFNzMUJjSGg0ZDNjc1ozSkpoSmxMRHdJREFRQUJBb0lCQVFDeWE3MjdSRXVrUjVJNQpXMTMvLzNQTEUxaGRacUF3RTFXc2oxemtCaFQzN2ZxT1hRVkIyMTJwK2c1Tlp5S0RTUW1iTHVhK1VMd0dSZVZlCm5CcHh4ODBzeUtvNHp5c3RTUGhIZk1YcHRNS2t4akpsQllqNytOMEVCVmNjUXF6VmFkaFFHbW9LTm4zdUVDTjcKbTVydlJkSDNpVDIwdzl0K3pxT2VQQ2IzMHNnS1ZKZEFJSnAzSjJjd1B3Si9BcjVnbUNROUlCcFJ4YVVpVDZqZwo4T1dvbDlJZ2FSanBmd1U5OWwvcG81VVpIQjVtNVdUNmVUTlZYc1grdEtFS2ZFaUR4a0tNcUZPdExhQnpESDduCnBMK1BYQXB4UzdMZllBWTM2Skc3MDFseC9KSzFPOCs0TFQ0aVMzeWdLdWxtcE4xUXFVZ3lZY1JLSGpPM2M1VmwKZUxZNGQ4Q0JBb0dCQU91UC84YUJNY2IwY0JjTE5JalBENnZNNE9LdUJsWjl3eGRzcks1TXprWXdlOW1xanhHegpuM1BLN0N0N0Q1bEpxZ3BGUlFOejRPWDAwRGJicVZvK2VRV1hZNnl5Qm92ZzJxbHRkUitsdWxzUkZqV3hqYitFCmFSSjhCTEJWbzFLam8rSCtMOWNGNFo0Unp2VXpYdUkxWENkSVZQeG1RZWJPenQvYUVXdDUyRWVSQW9HQkFOb1gKRHhzSFZHV3VMb3pGMkU2VHBvMThMdlN0ZEY4a3hacVQrNXg2RjJlTHhGQWhZczh6Z3c1QXpvcEY3aXBac1F6QgprU2pHVnB5b3FCUWpLN0l5czFlS2RIblNFY1FFQzIzWS9VMS9KU1BXR0g3bk50OEw3TkNzZXYrQzJtaG9UcWtVCm5wWTRYT1dWRXdORW9tTTRLeGx6VnJvUXdkNnBJbzZ5TDhSY2UxaWZBb0dBVFJzWmtoU0FBcXZJZFFLSjg2NHoKWnZ6dEw4WGU5VGk5UDFHblJIYUhucG9JTUR1UUVTOUdwbFJwOGVHYVBZYkxUZ2xXaWNiSWV2MGptcEZVWWVISgpJM2RtZlFUWTk3aG1Xc2NsYTNLSUNYOFNVZ2tJYVFRaWtKWmZ3b2lGcVdzL0haNWljblBPWWp0YUR4RDlvZlh0CmNENVE4ejFWblFOYzNCRTVXb0RMdHNFQ2dZRUFwNTFyVmFtbmV0S0pJbFo0YmNQYkVRaXRpZzI1ejlvU0tVQ3MKODlGK0pXM3RQbXk2WldkQXhYYVhodnhDRkxpRWM3cGRWMHBBalB5dTJYTkNoUjJrYXBhVitINjBlc05sQ1ZMcApNMk9SNXQ0SVM1aG11cnlPa0w3UGRZdGJVejAvbjRHaWRPL3lyZHlLRlV2dHhuWUg0ZktjYURxeTFlK0dDTWY0CklHRzN4eDhDZ1lFQWlocWpVa2IwakJQcnZScjBZUlc5cnFnOFZmWStxSWFHelRMKzRlREtscGRVNjY0WmNVeC8KRHVsd1VrQzF0bVg3UU1laTJPTENSYjdmWWtZeFFDMTJId29jVy9CTHByMHBvVmNiUVZ4akNWRVlNOWgvMm9MMApVbEhrbUdBcW9jUk1LR3ZxVEJYd0FoOFZkZlZVbFB1bEYwOEdXV0Q1eGo1cWxQOXZwRTIzL1VVPQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=';

const defaultContainer = {
  name: 'api',
  image: interpolate`getlago/api:${tag}`,
  imagePullPolicy: 'IfNotPresent',
  ports: [{ containerPort: 3000 }],
  env: [
    {
      name: 'DATABASE_URL',
      value: databaseUrl,
    },
    {
      name: 'REDIS_URL',
      value: redisUrl,
    },
    {
      name: 'LAGO_REDIS_CACHE_URL',
      value: redisUrl,
    },
    {
      name: 'SECRET_KEY_BASE',
      value: secretKeyBase,
    },
    {
      name: 'RAILS_ENV',
      value: 'production',
    },
    {
      name: 'LAGO_FRONT_URL',
      value: interpolate`https://${frontendDomain}`,
    },
    {
      name: 'LAGO_API_URL',
      value: interpolate`https://${apiDomain}`,
    },
    {
      // TODO: Replace and move to a secret
      name: 'RSA_PRIVATE_KEY',
      value: rsaPrivateKey,
    },
    {
      // TODO: Replace and move to a secret
      name: 'LAGO_RSA_PRIVATE_KEY',
      value: rsaPrivateKey,
    },
    {
      // TODO: Replace and move to a secret
      name: 'ENCRYPTION_PRIMARY_KEY',
      value: 'not-a-secret',
    },
    {
      // TODO: Replace and move to a secret
      name: 'ENCRYPTION_DETERMINISTIC_KEY',
      value: 'not-a-secret',
    },
    {
      // TODO: Replace and move to a secret
      name: 'ENCRYPTION_KEY_DERIVATION_SALT',
      value: 'not-a-secret',
    },
    {
      name: 'LAGO_USE_AWS_S3',
      value: 'false',
    },
    {
      // TODO: Replace with actual instance of gotenberg
      name: 'LAGO_PDF_URL',
      value: 'not-a-service',
    },
    {
      name: 'LAGO_DISABLE_SEGMENT',
      value: 'true',
    },
    {
      name: 'LAGO_AWS_S3_ACCESS_KEY_ID',
      value: 'not-a-secret',
    },
    {
      name: 'LAGO_AWS_S3_SECRET_ACCESS_KEY',
      value: 'not-a-secret',
    },
    {
      name: 'LAGO_AWS_S3_REGION',
      value: 'not-a-region',
    },
    {
      name: 'LAGO_AWS_S3_BUCKET',
      value: 'not-a-bucket',
    },
  ],
};

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
        containers: [
          defaultContainer,
          {
            ...defaultContainer,
            name: 'api-worker',
            command: ['./scripts/start.worker.sh'],
            ports: [],
          },
          {
            ...defaultContainer,
            name: 'lago-clock',
            command: ['./scripts/start.clock.sh'],
            ports: [],
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
    ports: [
      {
        port: 3000,
      },
    ],
    selector: deployment.spec.selector.matchLabels,
  },
});
