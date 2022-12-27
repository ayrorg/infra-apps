import { Config } from '@pulumi/pulumi';

const config = new Config('lago');

export const frontendDomain = 'lago.cc.ayr.no';
export const apiDomain = 'api.lago.cc.ayr.no';

export const tag = config.require('tag');
