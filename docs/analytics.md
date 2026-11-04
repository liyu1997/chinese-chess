# 妙棋手埋点与查看方式

状态：埋点代码已准备；默认关闭，填入真实 PostHog 项目配置后才开始采集。不会补回接入前的数据。

## 激活

1. 在 PostHog 创建“妙棋手”项目，选择 Web / JavaScript。
2. 从安装页复制 Project token（phc_ 开头）和 API host。
3. 编辑 dist/analytics-config.js：enabled 改为 true，填 token 与 host。当前允许官方 US / EU ingestion host。此处只放公开项目 token，禁止放个人 API key。
4. 发布 main 后，在 PostHog Activity 中检查真实事件。用手机、PC、微信内置浏览器分别测试。用真实国内网络验证采集成功率。
5. 项目报表时区设为 Asia/Shanghai；调试数据和自己的测试账号应从正式看板排除。

统计入口为 PostHog 项目的 Dashboards、Product analytics 和 Activity，无需另建查看平台。须有该项目访问权限。

## 三张看板配置

| 看板 | 指标与口径 |
|---|---|
| 经营概况 | page_viewed 去重访客；实际玩家为 first_move_made 或 online_action_succeeded 且 action=move 的去重用户；新玩家以首次成功走棋为准；次日和第7日留存都以成功走棋为起点与回访事件 |
| 玩法表现 | game_started 按 mode/level 分组；game_ended 胜/负/和；skin_changed 按 to_skin；undo_used、immersive_changed 功能使用人数 |
| 体验质量 | home_viewed → game_started → first_move_made 用户漏斗（30分钟窗口）；room_created/room_joined → online_action_succeeded(action=ready) → online_game_started 联机漏斗；ai_move_completed.duration_ms 和 online_action_succeeded(action=move).duration_ms 的中位数/P95；request_failed、online_action_failed、online_disconnected |

联机创建者与受邀者漏斗应分开；登录不是游客单机的必经步骤。

## 事件口径

- game_started / first_move_made / game_ended：人机及同屏本地对局。同一 game_id 在当前浏览器30天内去重（至多保留1000条标记）。人机 outcome 为 win/loss/draw，同屏为 red_win/black_win/draw。需按 mode 过滤后计算胜率。
- 在线对局使用 online_game_started、online_game_resumed、online_game_ended，均为每个玩家观察到的服务端状态。刷新、重连不反复计数。中途进入已有走棋的对局记 resumed，不补造 started。
- 在线事件两位玩家各上报一次；看开局/完局人数按用户统计，看对局数按 game_id 去重，不能直接使用事件条数。正式战绩与结算仍以现有服务端数据库为准；这批改动没有给统一账号服务新增服务端埋点。
- room_created / room_joined、login_succeeded / registration_succeeded：接口返回成功后记录；失败记 request_failed，附 action/status/category。没有记录原始错误文本、请求体或接口中的房间号。
- online_action_requested / succeeded / failed：action=ready/move 等，成功耗时为客户端提交到收到服务端确认的耗时，不是另一位玩家屏幕显示耗时。
- ai_move_completed：一次实际完成的AI搜索，含调度和计算时间。取消的搜索不记完成；故障记录 game_error。
- board_ready：当前页面首次完成可交互棋盘渲染，含 render_ms 与 since_navigation_ms。基础棋子兜底可操作即可记录，不代表所有高清图片已完成加载。首页首次 since_navigation_ms 可用作自定义就绪指标，不能把游戏页该字段当作加载时长。
- 对局 duration_ms 为创建到结束的墙钟时间，可能包含切后台和中断；尚未统计前台活跃时长。未结束对局不可仅凭离开页面判输或认定永久流失。

## 实施边界

- SDK 异步加载，自动点击采集、会话录屏、异常自动采集和热图关闭。采集失败不阻塞下棋。
- 登录以内部用户ID关联，退出登录重置身份；不主动上报用户名、邮箱、密码、URL查询串或可直接使用的邀请链接。联机game_id使用房间信息的SHA-256摘要。
- 原始URL/referrer相关属性在发送前移除；不自动保存渠道参数。当前只区分微信浏览器与普通浏览器，不包含完整渠道归因。
- 遵循SDK的Do Not Track设置。正式启用前应把实际收集用途和第三方服务写进产品隐私说明，并按适用要求处理用户选择。
- 浏览器拦截、离线、关闭页面均可能导致漏报；对局数与数据库对账才可校验覆盖率。客户端事件不能作为排名或奖惩依据。
- 下期可接统一服务端的建房、开局和结算事件，再补邀请落地、渠道白名单、前台时长和对方渲染确认指标。

## 验证

node tests/analytics.cjs

覆盖重复结算、刷新去重、登录/退出身份、敏感字段与邀请凭证过滤、未配置禁用及SDK不可达时的隔离。上线后仍需用真实项目验证接收与报表配置。
