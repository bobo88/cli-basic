#!/usr/bin/env node

// minimist: 轻量级的命令行参数解析引擎
import minimist from 'minimist'
// prompts: 提供轻量级的交互式提示
import prompts from 'prompts'
// kolorist: 在 stdin/stdout 中设置字体颜色的轻量库
import { red, green, bold } from 'kolorist'
// download-git-repo: 下载仓库源码的库
import downloadGitRepo from 'download-git-repo'
// ora: 优雅的终端旋转器（就是提供转圈圈的loading功能的）
import ora from 'ora'

const spinner = ora('下载中...')

async function init() {
  const argv = minimist(process.argv.slice(2))

  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'vue-project' : targetDir

  let result = {}

  try {
    result = await prompts(
      [
        {
          name: 'needsSteps',
          type: () => 'select',
          message: '请选择你要执行的步骤?',
          initial: 0,
          choices: (prev, anwsers) => [
            { title: '取消', value: false },
            {
              title: '初始化项目',
              description: '将 VUE-admin 项目从远程git拉取到本地 project 目录',
              value: 'pull'
            },
            {
              title: '项目安装依赖',
              description: '将初始化的项目install相关的依赖',
              value: 'install'
            },
            {
              title: '项目单元测试',
              description: '对项目进行单元测试',
              value: 'unit'
            },
            {
              title: '项目部署',
              value: 'push'
            }
          ],
        },
        {
          type: prev => prev == 'install' ? 'toggle' : null,
          name: 'needsInstall',
          message: '确定下载所有依赖？',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        }
       // ... 更多定制化 TODO
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const { needsSteps: stepName, needsInstall } = result;

  if (stepName === 'pull') {
    spinner.start()
    await downloadGitRepo('github:bobo88/nuxt-web', `${defaultProjectName}`, ()=> {
      spinner.succeed(bold(green('下载完成.')))
      console.log()
    })
  } 
  
  if (needsInstall) {
    spinner.start('依赖install中...');
    console.log();
    spinner.succeed(bold(green('Install完成.')))
    console.log();
  } 
  
  if (stepName === 'unit') {
    spinner.start('单元测试中...');
    console.log();
    spinner.succeed(bold(green('测试完成.')))
    console.log();
  } 
  
  if (stepName === 'push') {
    spinner.start('项目部署测试中...');
    console.log();
    spinner.succeed(bold(green('部署完成.')))
    console.log();
  }
}

init().catch((e) => {
  console.error(e)
})
