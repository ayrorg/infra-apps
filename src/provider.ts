import * as google from '@pulumi/google-native';
import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { clusterLocation, clusterName, project } from './config';

const cluster = google.container.v1.getClusterOutput({
  location: clusterLocation,
  clusterId: clusterName,
  project,
});

export const kubeconfig = pulumi
  .all([cluster.name, cluster.endpoint, cluster.masterAuth, project])
  .apply(([name, endpoint, masterAuth, projectName]) => {
    const context = `${projectName}_${name}`;

    return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: gke-gcloud-auth-plugin
      installHint: Install gke-gcloud-auth-plugin for use with kubectl by following
        https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke
      provideClusterInfo: true
`;
  });

export const nullProvider = new k8s.Provider('null-provider', {
  kubeconfig,
});

const namespace = new k8s.core.v1.Namespace('app-namespace', {
  metadata: {
    name: `app-${pulumi.getStack()}`,
  },
});

export const provider = new k8s.Provider(
  'k8s-provider',
  {
    kubeconfig,
    namespace: namespace.metadata.name,
  },
  { dependsOn: namespace },
);
