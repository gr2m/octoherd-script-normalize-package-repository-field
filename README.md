# octoherd-script-normalize-package-repository-field

> Remove redundant information from repository, homepage, bugs fields in package.json

[![@latest](https://img.shields.io/npm/v/octoherd-script-normalize-package-repository-field.svg)](https://www.npmjs.com/package/octoherd-script-normalize-package-repository-field)
[![Build Status](https://github.com/gr2m/octoherd-script-normalize-package-repository-field/workflows/Test/badge.svg)](https://github.com/gr2m/octoherd-script-normalize-package-repository-field/actions?query=workflow%3ATest+branch%3Amain)

This script turns

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/octocat/hello-world.git"
  },
  "bugs": {
    "url": "https://github.com/octocat/hello-world/issues"
  },
  "homepage": "https://github.com/octocat/hello-world/#readme"
}
```

into

```json
{
  "repository": "github:octocat/hello-world"
}
```

`"bugs"` and `"homepage"` are derived from the repository if it is hosted on GitHub. Learn more about `package.json`'s [repository](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#repository), [bugs](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bugs), and [homepage](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#homepage) fields

## Usage

Minimal usage

```js
npx octoherd-script-normalize-package-repository-field
```

Pass all options as CLI flags to avoid user prompts

```
npx octoherd-script-normalize-package-repository-field \
  -T ghp_0123456789abcdefghjklmnopqrstuvwxyzA \
  -R "gr2m/*"
```

## Options

| option                       | type             | description                                                                                                                                                                                                                                 |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--octoherd-token`, `-T`     | string           | A personal access token ([create](https://github.com/settings/tokens/new?scopes=repo)). Script will create one if option is not set                                                                                                         |
| `--octoherd-repos`, `-R`     | array of strings | One or multiple space-separated repositories in the form of `repo-owner/repo-name`. `repo-owner/*` will find all repositories for one owner. `*` will find all repositories the user has access to. Will prompt for repositories if not set |
| `--octoherd-bypass-confirms` | boolean          | Bypass prompts to confirm mutating requests                                                                                                                                                                                                 |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## About Octoherd

[@octoherd](https://github.com/octoherd/) is project to help you keep your GitHub repositories in line.

## License

[ISC](LICENSE.md)
