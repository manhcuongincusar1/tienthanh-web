// UMI prod env overrides. Empty cho phép UMI_ENV=prod load .env.prod
// (UMI 3.x requires config/config.<UMI_ENV>.ts khi UMI_ENV set).
import { defineConfig } from 'umi';

export default defineConfig({});
