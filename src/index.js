
const fs = require('fs');
const path = require('path');

const EMPTY = Symbol('EMPTY');

const defaultConf = {
  extensions: '.*',
  ignoreExtensions: null,
  ignoreFiles: '\\..*',
  ignoreFolders: 'node_modules',
  includeFiles: true,
};

// ===== Utils =====

const applyConf = conf => Object.assign({}, defaultConf, conf);

const isDirectory = currentPath => fs.lstatSync(currentPath).isDirectory();

const convertRuleToRegex = (rule) => {
  if (!rule) {
    return null;
  }
  return new RegExp(`^(${rule.split(',').join('|')})$`);
};

const convertExtensionsToRegex = (extensions) => {
  if (!extensions) {
    return null;
  }
  return new RegExp(`(${extensions.split(',').join('|')})$`);
};

// ===== GetFile =====

const getFile = (filePath, config) => {
  const conf = applyConf(config);
  const ignoreRule = convertRuleToRegex(conf.ignoreFiles);
  const filename = path.basename(filePath);
  if (
    filename.match(ignoreRule) ||
    !filename.match(convertExtensionsToRegex(conf.extensions)) ||
    filename.match(convertExtensionsToRegex(conf.ignoreExtensions))
  ) {
    return null;
  }
  return filePath;
};

// ===== GetTree =====

/**
 *
 * @param {string} rootPath Path to the root folder
 * @param {string} config.extensions Only include files of these extensions
 * @param {string} config.ignoreExtensions Exclude files of these extensions
 * @param {string} config.ignoreFiles Regex to ignore certain files
 * @param {string} config.ignoreFolders Regex to ignore certain folders
 * @param {boolean} config.includeFiles Should list files in the tree
 */
const getTree = (rootPath, config) => {
  const conf = applyConf(config);
  // If just a file
  if (!isDirectory(rootPath)) {
    throw new Error('Must provide a path to a directory');
  }
  const ignoreRule = convertRuleToRegex(conf.ignoreFolders);
  return fs
    .readdirSync(rootPath)
    .filter(currentPath => !path.basename(currentPath).match(ignoreRule))
    .reduce((tree, currentPath) => {
      const resolvedPath = path.resolve(rootPath, currentPath);
      if (isDirectory(resolvedPath)) {
        const subTree = getTree(resolvedPath, conf);
        if (subTree[EMPTY]) {
          return { ...tree, [EMPTY]: true };
        }
        return { ...tree, [currentPath]: subTree, [EMPTY]: false };
      }
      const file = getFile(resolvedPath, conf);
      if (file === null) {
        if (Object.keys(tree).length === 0) {
          return { ...tree, [EMPTY]: true };
        }
        return { ...tree, [EMPTY]: false };
      }
      if (!conf.includeFiles) {
        return { ...tree, [EMPTY]: false };
      }
      return { ...tree, [currentPath]: null, [EMPTY]: false };
    }, {});
};

module.exports = getTree;
