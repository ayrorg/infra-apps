import { Config } from '@pulumi/pulumi';

const config = new Config();

export const apiDomain = config.require('api-domain');

const clusterConfig = new Config('cluster');

export const clusterName = clusterConfig.require('name');
export const clusterLocation = clusterConfig.require('location');

const googleConfig = new Config('google');

export const project = googleConfig.require('project');
