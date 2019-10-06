/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const core = require("@actions/core");
const github = require("@actions/github");
const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
const { context } = github;

(async () => {
  try {
    const { data: labels } = await octokit.issues.listLabelsOnIssue({
      ...context.repo,
      issue_number: context.issue.number
    });

    const hasContentLabel = labels
      .map(label => label.name)
      .includes(core.getInput('label'));

    if (hasContentLabel) {
      await octokit.issues.createComment({
        ...context.repo,
        issue_number: context.issue.number,
        body: core.getInput('message')
      });
    }
  } catch (err) {
    core.setFailed(err.message);
  }
})();
