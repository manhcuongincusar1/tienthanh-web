# Tita CMS React

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```
## GIT

### New Feature
#### Step 1
* Create a new brand from the Development [branches](https://gitlab.com/mpire-projs-2022/tita-reactjs/-/branches) with prefix feature-{**branches**}.
* After finishing the new feature, merge your code from the new branch into Development.
  * Remove the new branch or not.
#### Step 2
* Switch to [CI/CD](https://gitlab.com/mpire-projs-2022/tita-reactjs/-/pipelines)
  * Start the docker-build-web stage.
