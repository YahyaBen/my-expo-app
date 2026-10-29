# Local SonarQube analysis

The project uses SonarQube Community Build locally at
[localhost:9000](http://localhost:9000/dashboard?id=my-app-expo).
The Docker container is named `my-app-expo-sonarqube` and publishes its web port
only on `127.0.0.1`. Its data, logs, and extensions use dedicated Docker volumes.
This is a local evaluation instance with an embedded database.

`sonar-project.properties` scans application code, maintained Storybook code,
GitHub workflows, and app/build configuration. Automated tests and their helpers
have been removed. Generated `storybook.requires.ts` is excluded.
Dependencies, native build output, assets, and documentation are outside the
configured source roots. Scanner output and local credentials are Git-ignored.

## Start and stop

```powershell
docker desktop start
docker start my-app-expo-sonarqube
```

Wait for `http://localhost:9000/api/system/status` to return `UP` before scanning.
Stop the server when finished; the Docker volumes preserve the analysis:

```powershell
docker stop --time 60 my-app-expo-sonarqube
```

The original container was created with the official pinned image:

```powershell
docker run -d --name my-app-expo-sonarqube --stop-timeout 60 --memory 3g -p 127.0.0.1:9000:9000 -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -v my-app-expo-sonarqube-data:/opt/sonarqube/data -v my-app-expo-sonarqube-logs:/opt/sonarqube/logs -v my-app-expo-sonarqube-extensions:/opt/sonarqube/extensions sonarqube:26.9.0.129388-community
```

## Dashboard login and repeat scans

The administrator username is `admin`. Its generated password and the project
analysis token are encrypted with Windows user protection in
`.sonarqube-local/admin-password.dpapi` and `.sonarqube-local/token.dpapi`.
Only the Windows account that created them on this computer can decrypt them.
To display the password for logging into the local dashboard:

```powershell
$sonarPassword = Get-Content .sonarqube-local/admin-password.dpapi | ConvertTo-SecureString
$sonarCredential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList 'admin', $sonarPassword
$sonarCredential.GetNetworkCredential().Password
```

Run from the project root:

```powershell
npm run typecheck
npm run lint
$env:SONAR_HOST_URL = 'http://localhost:9000'
$token = Get-Content .sonarqube-local/token.dpapi | ConvertTo-SecureString
$sonarCredential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList 'token', $token
$env:SONAR_TOKEN = $sonarCredential.GetNetworkCredential().Password
try {
  npx --yes @sonar/scan@5.0.1 '-Dsonar.scm.disabled=true' '-Dsonar.qualitygate.wait=true'
} finally {
  Remove-Item Env:SONAR_TOKEN
}
```

For another server, supply its URL through `SONAR_HOST_URL` and its analysis token
through `SONAR_TOKEN`. Override the project key with `-Dsonar.projectKey=...` when
needed. Keep credentials out of committed configuration and command arguments.

The local command disables SCM attribution because the initial scan failed in
Sonar's JGit blame reader with `MissingObjectException`. Native Git can read the
reported blob, so the failure does not establish repository corruption. This
workaround omits blame annotations and automatic author assignment; new code is
identified by analysis dates. Omit `-Dsonar.scm.disabled=true` when scanning a
checkout where blame works. The project configuration leaves SCM enabled by
default.

## Interpretation limits

This checkout has no automated test suite or instrumented coverage report.
Missing or zero SonarQube coverage is not a measured execution result. If a valid
LCOV report is added later, provide its path with
`-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info`.

Check the scanner's TypeScript support against the installed compiler when
upgrading. Inspect the current scan's diagnostics and quality gate instead of
reusing an old issue count. Static analysis does not verify native rendering,
device behavior or live-backend correctness.

References: [official Docker image](https://hub.docker.com/_/sonarqube),
[NPM scanner configuration](https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/scanners/npm/configuring),
[JavaScript/TypeScript support](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/javascript-typescript-css).
