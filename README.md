# Daily Killer Sudoku Assumed Sums

给 Daily Killer Sudoku 的无和数笼子设置假设和，在原站继续查看候选组合、填候选数字和计算完整选区的总和。

**[安装／下载用户脚本](https://raw.githubusercontent.com/Hakuya1231/daily-killer-enhance/v1/daily-killer-hypothetical-sums.user.js)** · [查看脚本源码](https://github.com/Hakuya1231/daily-killer-enhance/blob/v1/daily-killer-hypothetical-sums.user.js) · [打开触屏版示例题](https://www.dailykillersudoku.com/m/puzzle/32398)

脚本名称为 **Daily Killer Sudoku Assumed Sums**。当前脚本位于仓库的 `v1` 分支，安装链接指向该分支。每位使用者都需要先在自己的浏览器中安装脚本管理器和本脚本。

## 功能

- 用 **Assumed Sum** 面板给无和数笼子添加、修改或清除假设和，保存后在笼子左上角显示彩底数字。
- 面板提供独立小键盘、格数、**Save** 和 **Clear**。电脑也可以聚焦输入框后用实体数字键输入。
- 在原站 **Combinations** 中查看当前假设笼的候选组合。选笼、保存时保留当前标签，用户可以手动打开 **Assume** 或 **Combinations**。
- 开启原站 **Fill uses cage combinations** 时，**Fill** 使用假设和对应的候选数字，填充操作可以通过原站 **Undo** 撤销。
- 完整选中多个笼子时，将假设和与原题和数一起求和。只选中笼子的一部分时，该笼的和数不计入。
- 按题号在当前浏览器中保存假设和，刷新后恢复。确认 **Start Again → Yes** 会清空当前题目的假设和、标记及相关候选组合。

仅在包含无和数笼子的 9×9 题目中显示面板。支持原站 `/puzzle/…`、`/m/puzzle/…`、`/d/puzzle/…` 和 `/k/puzzle/…` 布局，面板与按钮使用英文。

## 选择安装方式

| 设备 | 浏览器与脚本管理器 | 后续步骤 |
| --- | --- | --- |
| Windows、macOS、Linux | Chrome、Edge 或 Firefox + Tampermonkey | 电脑安装 |
| iPhone、iPad | Safari + Userscripts | iOS / iPadOS 安装 |
| Android 手机、平板 | Firefox + Tampermonkey | Android 安装 |

下面的移动端步骤分别依据 Userscripts 和 Mozilla 的官方文档整理。项目已进行桌面 Chromium 与手机／平板尺寸的触屏模拟验证，iOS Safari、Android Firefox 的扩展安装及真机运行仍待验证。

## 电脑安装

1. 从 Tampermonkey 官网选择自己的浏览器，安装扩展。[Tampermonkey 官网](https://www.tampermonkey.net/)
2. 在同一浏览器打开本文顶部的「安装／下载用户脚本」，在 Tampermonkey 安装页确认安装。若打开的是源码，可复制全文，在 Tampermonkey 的「添加新脚本」中替换默认模板，再保存。[官方脚本安装说明](https://www.tampermonkey.net/faq.php?q=Q102)
3. Chrome 用户在扩展管理页进入 **Tampermonkey → 详情**，启用 **Allow User Scripts / 允许用户脚本**。如果浏览器版本只提供开发者模式入口，按官方说明开启。Edge 用户也可参考同一说明。[脚本执行权限说明](https://www.tampermonkey.net/faq.php?q=Q209)
4. 打开或刷新示例题。在桌面布局中，**Assumed Sum** 面板位于右侧 **Combinations** 上方。[桌面版示例题](https://www.dailykillersudoku.com/puzzle/32398)

如果已经下载了 `daily-killer-hypothetical-sums.user.js`，也可以用文本编辑器打开文件，将全部内容复制到 Tampermonkey 的新脚本编辑器中保存。

## iOS / iPadOS 安装

使用 Safari 安装和做题。

1. 从 App Store 安装 **Userscripts**，开发者为 **quoid**。[App Store](https://apps.apple.com/app/id1463298887)
2. 打开 Userscripts，确认脚本保存目录。可以使用默认目录，也可以选择「文件」App 中的一个 iCloud Drive 文件夹。[Userscripts 官方说明](https://github.com/quoid/userscripts#ios-ipados)
3. 在系统设置中搜索 **Safari**，进入 **扩展 → Userscripts** 并启用。回到 Safari，打开扩展菜单，为 `www.dailykillersudoku.com` 允许 Userscripts 访问。Safari 菜单入口随系统版本可能显示为页面菜单、`aA` 或扩展图标。[扩展启用说明](https://github.com/quoid/userscripts#ios-ipados)
4. 在 Safari 打开本文顶部的「安装／下载用户脚本」。源码页面打开后，点 Safari 的扩展菜单，打开 **Userscripts**，按提示安装脚本。[脚本安装说明](https://github.com/quoid/userscripts#ios-ipados)
5. 打开触屏版示例题，打开一次 Userscripts 扩展弹窗，确认 **Daily Killer Sudoku Assumed Sums** 已启用，然后刷新题目。窄屏版标签顺序为 **Comb → Calc → Assume → Menu**。[触屏版示例题](https://www.dailykillersudoku.com/m/puzzle/32398)

也可以直接将 `.user.js` 文件放入 Userscripts 的脚本目录，保留文件扩展名，然后在 Safari 打开 Userscripts 弹窗，等待列表加载完成后刷新题目。[文件安装与读取说明](https://github.com/quoid/userscripts)

### 用 iCloud Drive 同步脚本

自己的多台 Apple 设备可以将 Userscripts 保存目录设为同一个 iCloud Drive 文件夹。更新该文件后，等待 iCloud 完成同步，再在各设备上打开 Userscripts 弹窗并刷新题目。如果系统提供「保持下载」选项，可为脚本文件夹开启，确保扩展能读到文件。[iCloud 目录说明](https://github.com/quoid/userscripts#ios-ipados)

该方式同步的是脚本文件。每台设备都需要安装并启用 Userscripts，假设和数据仍保存在各自的浏览器中。

## Android 安装

使用 **Firefox for Android + Tampermonkey**。Mozilla 的扩展页面提供 Android 版 Tampermonkey。[Tampermonkey 扩展页](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

1. 安装并打开 Firefox for Android。
2. 点 Firefox 的菜单按钮，进入 **扩展 / Extensions**，找到 Tampermonkey 并安装。也可以在 Firefox 中打开上面的 Tampermonkey 扩展页进行安装。[Mozilla 扩展安装说明](https://support.mozilla.org/en-US/kb/find-and-install-add-ons-firefox-android)
3. 在 Firefox 中打开本文顶部的「安装／下载用户脚本」，在 Tampermonkey 安装页确认安装。若只显示源码，从 Firefox 的扩展菜单进入 Tampermonkey 管理面板，添加新脚本，粘贴完整源码并保存。[Tampermonkey 安装说明](https://www.tampermonkey.net/faq.php?q=Q102)
4. 在同一个 Firefox 浏览器中打开触屏版示例题，刷新后手动点 **Assume** 标签。[触屏版示例题](https://www.dailykillersudoku.com/m/puzzle/32398)

Android 版 Chrome 的「添加到桌面」会为电脑端添加扩展。要在 Android 手机上使用本脚本，请按上面的 Firefox 安装步骤操作。[Chrome 扩展说明](https://support.google.com/chrome_webstore/answer/2664769?hl=zh-Hans)

## 使用方法

### 设置假设和

1. 点击无和数笼子的任意一格。
2. 手机窄屏版手动打开 **Assume** 标签，电脑在右侧找到 **Assumed Sum** 面板。
3. 查看格数，例如 `3 cells`，用面板内的小键盘输入和数，例如 `15`。电脑可以聚焦右上方输入框后使用实体键盘。
4. 点 **Save**，笼子左上角会显示彩底 `15`。
5. 手动打开 **Combinations**，查看该笼的候选组合。重新选择该笼的其他格子也会更新候选组合。

修改时，重新选中笼子，在面板中输入新和数并保存。点 **Clear** 会删除当前笼子的假设，并更新标记和候选组合。

输入和数后，脚本直接保存。没有可行组合的和数会得到空候选列表。

### 用 Fill 填入候选数字

1. 在原站 **Preferences** 中启用 **Fill uses cage combinations**。
2. 给无和数笼子保存一个假设和。
3. 回到盘面，选中要填候选的格子，点击原站 **FILL**，电脑也可按 `F`。

例如，三格笼的假设和为 `6` 时，对应组合为 `1 2 3`，Fill 会将这些候选数字填入选中的格子。保留原站偏好设置的含义，关闭 **Fill uses cage combinations** 时，Fill 使用全部数字。

### 计算选区和

在电脑上用 Shift 多选或鼠标拖选，在触屏上拖选格子。完整选中假设和为 `15` 的笼子及原题和为 `11` 的笼子时，**Combinations** 显示 `26`。假设笼只选中一部分时，只计入完整选中的 `11`。

### 清空当前题目的假设

使用原站 **Start Again**，并在确认框中选择 **Yes**，会同时清空当前题目的假设和、本地保存记录、彩底标记及相关候选组合。选择 **No** 会保留它们。

## 更新脚本与数据保存

- **Tampermonkey** 可以重新打开安装链接进行更新，或在管理面板用新版本的完整源码替换旧内容并保存。
- **Userscripts** 可以重新安装，或用新文件覆盖脚本目录中的旧文件。文件变化后打开一次扩展弹窗，等待加载完成，再刷新题目。[Userscripts 文件读取说明](https://github.com/quoid/userscripts)
- 更新完成后，确认脚本管理器中只启用一份本项目脚本。
- 假设和按题号存储在原站的 `localStorage` 中。正常更新脚本后仍会保留，清除网站数据则会删除这些记录。
- 假设和由当前浏览器保存。更换浏览器或设备后，需要在新环境中重新设置，原站账号的进度同步与假设和数据各自独立。

## 常见问题

**看不到面板或 Assume 标签**

先用第 32398 题检查。只有含无和数笼子的题目才会出现面板。确认脚本和扩展已启用、扩展已获准访问原站，并刷新页面。电脑 Chrome 还需要检查 **Allow User Scripts**。在手机切到原站 Laptop/Desktop 布局后，面板会显示在右侧 Combinations 上方。

**点选笼子后没有自动切到 Assume**

手动点击 **Assume** 标签即可。面板中的格数和假设和会随当前选中的笼子更新。

**Save 或数字键不可用**

先选中无和数笼子的格子。选择原题已有和数的笼子或尚未选择格子时，编辑控件会禁用。

**Combinations 没有候选**

确认当前选中了已保存假设和的笼子，并打开 Combinations。若原站隐藏了组合，点 **Show** 恢复显示。输入的和数没有可行组合时，列表为空。

**Fill 仍然填入 1–9**

检查假设和是否已点 **Save**，并确认原站偏好设置中的 **Fill uses cage combinations** 已启用。

**iOS 文件已放好，刷新后仍然没有脚本**

检查文件是否位于 Userscripts 当前保存目录中，并保留 `.user.js` 后缀。打开 Safari 中的 Userscripts 弹窗，等待文件列表加载完成，确认脚本已启用后再刷新。使用 iCloud 时同时确认文件已经下载到当前设备。[Userscripts 官方说明](https://github.com/quoid/userscripts)

**反馈问题**

请附上题目链接、设备系统、浏览器、脚本管理器、脚本版本和复现步骤。布局问题可以同时提供截图。[提交 Issue](https://github.com/Hakuya1231/daily-killer-enhance/issues)
