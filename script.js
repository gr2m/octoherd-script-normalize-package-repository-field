/**
 * Remove redundant information from repository, homepage, bugs fields in package.json
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 */
export async function script(octokit, repository) {
  if (repository.archived) {
    octokit.log.info({ change: false }, `Repository archived`);
    return;
  }

  if (repository.fork) {
    octokit.log.info({ change: false }, `Repository is a fork`);
    return;
  }

  const owner = repository.owner.login;
  const repo = repository.name;

  let pkgContent;
  let pkgSha;
  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path: "package.json",
      }
    );

    pkgContent = atob(data.content);
    pkgSha = data.sha;
  } catch (error) {}

  if (!pkgContent) {
    octokit.log.info({ change: false }, `No package.json`);
    return;
  }

  const pkg = JSON.parse(pkgContent);

  // https://docs.npmjs.com/cli/v7/configuring-npm/package-json#repository
  const pkgRepository = `github:${owner}/${repo}`;

  const canUpdateRepository = pkg.repository !== pkgRepository;
  const canRemoveBugs = bugsPointsToRepositoryIssues(pkg, repository);
  const canRemoveHomepage = homepagePointsToRepository(pkg, repository);

  if (!canUpdateRepository && !canRemoveBugs && !canRemoveHomepage) {
    octokit.log.info({ change: false }, `No update necessary`);
    return;
  }

  octokit.log.debug(toRelevantProperties(pkg), `Before`);

  pkg.repository = pkgRepository;
  if (canRemoveBugs) delete pkg.bugs;
  if (canRemoveHomepage) delete pkg.homepage;

  octokit.log.debug(toRelevantProperties(pkg), `After`);

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner,
    repo,
    path: "package.json",
    sha: pkgSha,
    content: btoa(JSON.stringify(pkg, null, 2) + "\n"),
    message:
      "build(package): simplify repository fields\n\ncreated using @octoherd and https://github.com/gr2m/octoherd-script-normalize-package-repository-field",
  });

  octokit.log.info(
    {
      change: true,
      repository: canUpdateRepository,
      bugs: canRemoveBugs,
      homepage: canRemoveHomepage,
    },
    `package.json updated`
  );
}

if (!globalThis.btoa) {
  globalThis.btoa = (data) => Buffer.from(data).toString("base64");
}

if (!globalThis.atob) {
  globalThis.atob = (string) =>
    Buffer.from(string, "base64").toString("binary");
}

/**
 * Returns true if the package.json "bugs" field points to the repository's issues page
 *
 * @param {object} pkg
 * @param {import('@octoherd/cli').Repository} repository
 * @returns {boolean}
 */
function bugsPointsToRepositoryIssues(pkg, repository) {
  if (!pkg.bugs) return false;

  const bugsUrl = typeof pkg.bugs === "object" ? pkg.bugs.url : pkg.bugs;

  if (typeof bugsUrl !== "string") return false;

  return bugsUrl.startsWith(repository.html_url);
}

/**
 * Returns true if the package.json "bugs" field points to the repository's issues page
 *
 * @param {object} pkg
 * @param {import('@octoherd/cli').Repository} repository
 * @returns {boolean}
 */
function homepagePointsToRepository(pkg, repository) {
  if (!pkg.homepage) return false;

  return pkg.homepage.startsWith(repository.html_url);
}

/**
 *
 * @param {object} pkg
 * @returns {object}
 */
function toRelevantProperties(pkg) {
  const result = { repository: pkg.repository };

  if (pkg.bugs) result.bugs = pkg.bugs;
  if (pkg.homepage) result.homepage = pkg.homepage;

  return result;
}
