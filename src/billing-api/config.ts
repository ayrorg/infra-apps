import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('billing-api');

export const apiDomain = 'api.billing.cc.ayr.no';
export const tag = config.require('tag');
export const image = config.require('image');
export const logLevel = config.get('log-level') ?? 'info';
