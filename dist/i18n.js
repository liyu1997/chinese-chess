/* Display-only localization. Game state, notation and account data stay canonical. */
(()=>{
'use strict';
const KEY='miaoqi-language',supported=['zh-CN','en','es'];
let language='zh-CN';try{const saved=localStorage.getItem(KEY);if(supported.includes(saved))language=saved}catch{}
const en={
'语言':'Language','界面语言':'Language','选择你习惯使用的语言':'Choose your preferred language',
'妙棋手 · 来一局轻松的中国象棋':'Miaoqishou · Enjoy a game of Xiangqi','中国象棋':'Chinese Chess','妙棋手':'Miaoqishou',
'基础棋盘已就绪，正在加载对弈功能…':'Board ready. Loading game…','重新加载':'Reload','对弈功能加载较慢，基础棋盘已保留。请检查网络或重新加载。':'The game is taking longer to load. Check your connection or reload.','正在加载对弈功能，请稍候…':'Loading the game. Please wait…',
'墨方':'Black','朱方':'Red','红方':'Red','黑方':'Black','山隐':'Shanyin','山隐 · 棋友':'Shanyin · Opponent','同屏 · 棋友':'Local opponent','你执红 · 先手':'You play Red · First move',
'凝脂白玉 · 山水相望':'Jade · Mountains & Water','温玉雅宋':'Warm Jade','墨橙圆章':'Ink & Orange','简洁博弈':'Minimalist Xiangqi','轮到你了！':'Your turn!','红方走棋':'Red to move','黑方走棋':'Black to move','疏朗':'Clear Script','疏朗 · 黑体':'Clear Script','玲珑将相':'Little Generals','妙棋手系列':'Miaoqishou Collection','文字 · 墨橙':'Lettering · Ink & Orange','汉风 · 漫画':'Han-style · Comic',
'落子无悔，亦可重来。':'Every move is a new possibility.','棋逢趣手，落子有趣。':'Good company. Great moves.','小小棋子，大大天地。':'Small pieces. A world of possibilities.',
'开启新局':'New game','继续上次棋局':'Resume game','对弈方式':'Game mode','人机对弈':'Play computer','双人同屏':'Local two-player','联机对战':'Play online','即将开放':'Coming soon','棋力':'Difficulty','入门':'Beginner','进阶':'Intermediate','挑战':'Challenger','高手':'Expert','宗师':'Grandmaster',
'闲庭 · 入门':'Beginner','凝思 · 进阶':'Intermediate','试锋 · 挑战':'Challenger','纵横 · 高手':'Expert','入微 · 宗师':'Grandmaster','选择棋盘':'Choose a board','象棋学堂':'Learn Xiangqi',
'← 返回首页':'← Home','返回首页':'Home','个人中心':'Account & Settings','账号信息':'Account information','个人设置':'Preferences','尚未登录':'Not signed in','登录后可在妙棋手与桌游大厅使用同一账号':'Use one account for Miaoqishou and the Board Game Hall.','登录 / 注册':'Sign in / Sign up','退出登录':'Sign out','偏好设置':'Preferences','落子音效':'Move sounds','落子与吃子时播放声音':'Play sounds when moving and capturing','棋盘场景':'Board scene','柳岸行营':'Riverside Camp','素净棋盘':'Minimal Board','游戏说明':'How to play','了解基本走法和对弈规则':'Learn piece movements and game rules',
'请朱方落子':'Red to move','请墨方落子':'Black to move','轻触棋子，查看可行之处':'Tap a piece to see its legal moves','选择亮起的位置落子':'Choose a highlighted square','将军！请先解将':'Check! Protect your general','山隐正在凝思…':'Shanyin is thinking…','悔棋':'Undo','翻转':'Flip','沉浸模式':'Focus','退出沉浸':'Exit focus','退出沉浸模式':'Exit focus mode','求和':'Draw','认输':'Resign','更多':'More','音效关':'Sound off','音效开':'Sound on','♪　音效关':'♪ Sound off','♪　音效开':'♪ Sound on','切换皮肤':'Board style','重新开局':'Restart game','落子记录':'Move history','棋局自动保存':'Game saved automatically','当前浏览器无法保存棋局':'This browser cannot save the game','此处不可落子':'You cannot move here','棋局已退回上一步':'Move undone','已切换皮肤':'Board style changed','已切换为素净棋盘':'Minimal Board selected','已切换为柳岸行营':'Riverside Camp selected',
'轻松入局，适合熟悉走法。':'A relaxed introduction to piece movements.','基础攻防，适合日常练习。':'Basic attack and defense for everyday practice.','深入计算攻防变化，思考约 1 秒。':'Deeper tactics, with about 1 second per move.','高手强化：3倍思考预算，复杂局面最多约8.4秒。':'Expert: 3× thinking budget; up to about 8.4 seconds in complex positions.','宗师快思：开局约2秒内，中局约5秒内，复杂攻防及残局最多约7秒。':'Grandmaster: about 2 seconds in the opening, 5 in the middlegame, and up to 7 in complex positions or endgames.',
'重新开启一局？':'Start a new game?','当前棋局将被新的棋局替换。':'This will replace your current game.','确认新局 ↗':'Start new game ↗','继续此局':'Resume this game','确认认输？':'Resign this game?','认输后本局结束，对方获胜。':'Resigning ends the game and your opponent wins.','确认认输':'Confirm resignation','继续对弈':'Continue playing','红方获胜':'Red wins','黑方获胜':'Black wins','朱方获胜':'Red wins','墨方获胜':'Black wins','红方认输':'Red resigned','黑方认输':'Black resigned','和棋 · 双方同意':'Draw · By agreement','双方已同意和棋，本局结束':'Both players agreed to a draw. The game is over.','将死 · 此局已定':'Checkmate · Game over','困毙 · 无子可行':'Stalemate · No legal moves','此局已定，感谢对弈。':'Thanks for playing.','再来一局':'Play again','结束对局':'Finish game','你赢得了本局':'You won this game','对手赢得了本局':'Your opponent won','山隐赢得了本局':'Shanyin won this game','朱方赢得了本局':'Red won this game','墨方赢得了本局':'Black won this game','双方握手言和':'Both players agreed to a draw',
'向对方提议和棋？':'Offer a draw?','只有对方同意后，本局才会以和棋结束。对方拒绝则继续对弈。':'The game ends in a draw only if your opponent accepts. Otherwise, play continues.','发出和棋提议':'Offer draw','同意和棋':'Accept draw','拒绝和棋':'Decline draw','拒绝，继续对弈':'Decline and continue','电脑提出和棋':'Computer offers a draw','电脑已连续将军5轮，不能继续长将。是否同意和棋？拒绝后，电脑将改走非将军招法。':'The computer has checked five times in a row. Accept a draw? If declined, it must choose a non-checking move.','电脑已连续将军5轮，且没有可走的非将军招法。是否同意和棋？拒绝后，电脑将认输。':'The computer has checked five times and has no non-checking move. Accept a draw? If declined, the computer will resign.','对方未同意和棋，继续对弈':'Draw declined. Play continues.','你未同意和棋，电脑已改走非将军招法':'Draw declined. The computer chose a non-checking move.','电脑无法停止长将，认输':'The computer cannot stop perpetual check and resigns','请勿反复长将':'Avoid perpetual check','本局继续，不会自动判为和棋。':'Play continues; this does not automatically cause a draw.','知道了，继续对弈':'Got it, continue',
'方寸之间，自有章法':'A small board. A world of strategy.','点击己方棋子，再点击亮起的落点。红方先行，双方轮流落子；将死或困毙对方即获胜。':'Select your piece, then a highlighted destination. Red moves first and players alternate. Win by checkmating or stalemating your opponent.','车走直线，马走日且不可蹩腿，相象走田且不可过河、塞眼；仕士斜行九宫，将帅在九宫内直走一步，不能照面。炮隔一子吃子，兵卒前进一格，过河可横行，不能后退。':'Chariots move in straight lines. Horses move one orthogonal step then one diagonal step, unless blocked on the first step. Elephants move two squares diagonally, cannot cross the river, and can be blocked at the midpoint. Advisors move diagonally within the palace; generals move one orthogonal square there and must not face each other. Cannons capture over exactly one intervening piece. Soldiers advance one square, may also move sideways after crossing the river, and never retreat.','“人机对弈”为本地电脑棋友；“双人同屏”可与身边朋友轮流操作。支持悔棋、翻转、音效和自动续局。':'Play computer for a local AI opponent, or Local two-player to share a device with a friend. Undo, board flip, sounds and automatic saving are supported.','和棋须由一方提议、另一方同意；重复局面或长时间未吃子均不会自动判和。同一方连续5回合将军时，会提示变换走法，棋局继续。电脑最多连续将军5轮，再次长将前会提出和棋；拒绝后电脑必须变招，无可变招时认输。联机对战须先登录：创建房间并分享邀请链接，好友入座后双方点击准备即可开局。暂不含竞赛长捉裁定。':'A draw requires both players to agree. Repetition or a long sequence without captures does not automatically draw. After five consecutive checks, a player must change their play. The computer offers a draw before another repeated check; if declined, it must change its move or resign. Online play requires sign-in: create a room, share its invitation link, and start when both players are ready. Tournament perpetual-chase rulings are not included.','落子入局 ↗':'Let’s play ↗',
'登录妙棋手':'Sign in to Miaoqishou','用户名或邮箱':'Username or email','密码（至少10位）':'Password (at least 10 characters)','登录':'Sign in','注册新账号':'Create account','注册':'Sign up','取消':'Cancel','与桌游大厅共用一个账号。':'Use the same account as the Board Game Hall.','登录后直接进入好友的房间。':'After signing in, you will enter your friend’s room.','聚聚里桌游统一账号 · 已登录':'Jujuli shared account · Signed in','正在登录…':'Signing in…','正在创建账号…':'Creating account…','正在创建房间…':'Creating room…','正在进入好友房间…':'Joining your friend’s room…','正在确认邀请与登录状态…':'Checking invitation and sign-in…','连接超时，请重试':'Connection timed out. Please retry.','网络连接失败，请检查网络后重试。':'Connection failed. Check your network and retry.','请重新登录':'Please sign in again','重新登录':'Sign in again','重新尝试':'Retry','连接中…':'Connecting…','正在进入好友房间':'Joining your friend’s room','正在连接房间，请稍候…':'Connecting to the room. Please wait…','返回联机大厅':'Online lobby','先玩单机':'Play offline','这个房间已失效':'This room has expired','暂时无法进入房间':'Unable to join the room','房间已关闭或不存在，请让好友重新发送邀请，或创建一个新房间。':'This room is closed or does not exist. Ask for a new invitation or create a room.','登录状态已过期，重新登录后即可再次进入。':'Your session has expired. Sign in again to join.','连接超时，请检查网络后重试，也可以先玩单机。':'Connection timed out. Check your network and retry, or play offline.',
'创建好友房间':'Create a room','房间号已自动生成。创建后分享给好友，双方准备后开局。':'A room code has been generated. Share the room with a friend and start when both players are ready.','每方用时':'Time per player','确认创建':'Create room','返回当前房间':'Back to current room','已有房间号？':'Have a room code?','输入房间码':'Enter room code','房间码':'Room code','加入房间':'Join room','请输入正确的 8 位房间码':'Enter a valid 8-character room code','刚才的房间号已被使用，已重新生成，请再次确认创建。':'That room code was taken. A new code is ready; please confirm again.',
'邀请好友入座':'Invite a friend','好友点击链接即可进入房间；未登录时先登录，然后点击准备。':'Your friend can open this link, sign in if needed, and select Ready.','房间邀请链接':'Room invitation link','分享到微信':'Share to WeChat','复制邀请链接':'Copy invitation link','返回棋局':'Back to game','邀请链接已复制，发给好友即可。':'Invitation link copied. Send it to your friend.','邀请链接已复制':'Invitation link copied','请长按上方链接复制，发送给好友。':'Press and hold the link above to copy and send it.','请打开分享房间查看邀请链接':'Open Share room to see the invitation link','在微信中可点击右上角“…”转发给朋友或群聊。':'In WeChat, tap “…” at the top right to share with a friend or group.','点击分享到微信，在系统分享面板中选择微信；如未显示微信，可复制链接后发送。':'Use the share panel and select WeChat, or copy and send the link.','请粘贴到微信发送；好友点击链接即可入座。':'Paste the link into WeChat. Your friend can tap it to join.','请长按邀请链接复制，再发送到微信。':'Press and hold the invitation link to copy it into WeChat.',
'好友对战':'Play a friend','对局准备':'Get ready','房间信息':'Room info','收起对局准备':'Minimize room setup','等待好友入座':'Waiting for a friend','分享链接邀请好友':'Share a link to invite a friend','对局结束':'Game over','对局中':'In progress','已准备':'Ready','未准备':'Not ready','本局时间已锁定':'Time control is locked','调整用时后，双方需重新准备':'Changing time requires both players to ready again','由房主设置':'Set by the host','邀请好友':'Invite friend','准备好了':'Ready','取消准备':'Not ready','正在同步…':'Syncing…','先看看棋盘':'View board','连接恢复后自动同步，请稍候。':'The game will sync when reconnected. Please wait.','本局已结束。':'This game has ended.','对局已开始，祝你落子从容。':'Game started. Enjoy your game.','好友点击邀请链接入座，双方准备后自动开局。':'Your friend joins via the link. Play starts when both are ready.','你已准备好，等待好友准备。':'You are ready. Waiting for your friend.','双方都准备好后，对局自动开始。':'Play starts automatically when both players are ready.','连接中，正在恢复…':'Reconnecting…','已准备，等待好友':'Ready. Waiting for friend','点击准备，开始对弈':'Select Ready to start','落子确认中…':'Confirming move…','轮到你落子':'Your turn','等待对手落子':'Opponent’s turn','本局结束，可以创建新房间':'Game over. You can create a new room.','网络恢复后自动同步棋局':'The game will sync when reconnected','双方都点击准备后，自动开始对局':'Both players must select Ready to start','已向对手发出求和请求':'Draw offer sent','对手请求和棋，请确认':'Your opponent offers a draw','对手正在思考':'Your opponent is thinking','等待加入':'Waiting to join','红方先手':'Red moves first','分享房间':'Share room','离开房间':'Leave room','已离开房间':'Left the room','关闭':'Close','返回':'Back',
'我的战绩':'My results','查看战绩':'View results','复盘分析':'Game review','对局':'Games','胜':'Win','和':'Draw','负':'Loss','全部':'All','综合':'Overall','人机':'Computer','联机':'Online','刷新':'Refresh','加载更多':'Load more','超时判负':'Lost on time','认输结束':'Resigned','对手认输':'Opponent resigned','将死':'Checkmate','困毙':'Stalemate','双方和棋':'Draw by agreement','对手超时':'Opponent timed out','启蒙':'Novice','青铜':'Bronze','白银':'Silver','黄金':'Gold','铂金':'Platinum','钻石':'Diamond','大师':'Master','传奇':'Legend','初入棋林':'Newcomer','棋坛新秀':'Rising Talent','街巷好手':'Local Expert','棋社名家':'Club Champion','一方棋豪':'Regional Champion','国手风范':'National Master','棋道宗师':'Grandmaster','棋圣传说':'Legendary Master','正在同步账号战绩…':'Syncing account results…','正在载入战绩…':'Loading results…','账号战绩已同步；人机与联机分别记录，也可查看综合积分。':'Account synced. View computer, online or combined results.','未登录：人机战绩保存在本机。登录后新完成的对局可同步到账户。':'Offline computer results stay on this device. Sign in to sync new games.','登录并完成一局联机对弈，开启你的战绩。':'Sign in and finish an online game to begin your record.','还没有对局记录。下一局，就是新的开始。':'No games yet. Your next game is a new beginning.','云端暂未连接，已展示本机战绩。联网后可刷新同步。':'Showing local results. Refresh when connected to sync.','本局已保存在本机，联网后会继续同步。':'Saved on this device. Sync will resume when connected.',
'象棋学堂 · 每次学会一招':'Xiangqi Academy · One idea at a time','一步一步，走得更好':'Better moves, step by step','从会走，到会下。':'Learn the moves. Find your game.','看懂棋理，再亲手走一遍。让每一次落子，都更有把握。':'Understand the idea, then try it on the board. Play each move with more confidence.','继续我的学习 →':'Continue learning →','阶段目标：':'Goal: ','本阶段课程':'Lessons in this stage','每课约 2–4 分钟':'About 2–4 minutes per lesson','学习进度保存在当前设备':'Progress is saved on this device','红方在下 · 黑方在上':'Red below · Black above','← 上一步':'← Previous','下一步 →':'Next →','↶ 重来':'↶ Reset','自己试一试':'Try it yourself','给我提示':'Show hint','这一课，记住这几点':'Key points','容易走错的地方':'Common mistakes','一句话记住':'Remember this','标记已学会':'Mark complete','学习下一课 ↗':'Next lesson ↗','退出练习':'Exit practice','动手练习':'Practice','棋法讲解':'Demonstration','按提示完成这段棋法':'Follow the hints to play these moves','跟着棋盘，一步步看':'Follow the board step by step','已完成 ✓':'Completed ✓','回到第一课 ↗':'First lesson ↗','练习完成！你已亲手走完这段棋法。':'Practice complete! You played the full sequence.','演示完成：黑方已被将死，观察各子如何封住逃路。':'Demonstration complete: Black is checkmated. Notice how each escape is covered.','演示完成。点击“自己试一试”，亲手走一遍。':'Demonstration complete. Select Try it yourself to practice.','教学使用精简局面，突出本课棋理。练习按示范路线进行，黑方应手也由你操作。':'Simplified positions highlight each idea. Follow the demonstrated sequence and play both sides during practice.','原创教学示例 · 基础走法参考':'Original teaching examples · Movement rules:','中华民国象棋文化协会':'Chinese Chess Culture Association','· 学堂聚焦走法与棋理，不含竞赛长将长捉裁定。':'· Lessons cover movements and strategy, not tournament perpetual-check or chase rulings.'
};
Object.assign(en,{'战绩':'Results','妙棋手中国象棋标志':'Miaoqishou Chinese Chess logo','高清棋子加载失败，已保留基础棋子，可继续使用':'Detailed pieces could not load. You can keep playing with the basic pieces.','电脑暂时无法落子，请刷新后重试，当前棋局已保存。':'The computer could not move. Your game is saved; reload and retry.','电脑暂时无法落子，请刷新重试':'The computer could not move. Please reload and retry.'});
Object.assign(en,{
 "入门": "Beginner",
 "先学会走，再学会下": "Learn the moves before the strategy",
 "认识七种棋子的走法与限制，养成落子前先看安全的习惯。": "Learn the seven piece types and their limits. Check your safety before every move.",
 "能独立完成一局，不走违例棋。": "Finish a game independently without illegal moves.",
 "进阶": "Intermediate",
 "让每一枚棋子都有用": "Give every piece a role",
 "练习常见开局的出子思路。示范是布局入门路线，并非唯一最佳走法。": "Practice common opening development ideas. These examples are introductory lines, not the only best moves.",
 "理解出子、占位与保护，不靠死记棋谱。": "Understand development, placement and protection without memorizing moves.",
 "提高": "Advanced",
 "看见一步以后的变化": "See beyond the next move",
 "从将军、捉双、牵制和交换入手，学会同时观察进攻与对手的反击。": "Study checks, forks, pins and exchanges while watching for counterplay.",
 "落子前计算“我走、他应、我再走”。": "Calculate: my move, their reply, my next move.",
 "精进": "Endgames",
 "把优势变成胜势": "Turn an advantage into a win",
 "学习常见的基础杀法。观察控制逃路的棋子，比只看将军的棋子更重要。": "Learn basic mating patterns. Pieces covering escape squares matter as much as the checking piece.",
 "认识典型杀形，理解各子如何协同。": "Recognize mating patterns and piece coordination.",
 "车：直来直往": "Chariot: Straight lines",
 "沿横线、竖线行走，路径上不能有棋子。": "Move horizontally or vertically along a clear path.",
 "车每步可沿一条直线走任意格，不能斜走，也不能跳过棋子。": "A chariot moves any distance in a straight line. It cannot move diagonally or jump pieces.",
 "落点有敌子可以吃掉；有己方棋子就不能落在那里。": "Capture an enemy on the destination square; never land on your own piece.",
 "车的活动空间很重要，先看整条路线是否畅通。": "Open space matters. Check the whole path before moving.",
 "不要把车当成炮：车不能隔着一枚棋子吃子。": "A chariot is not a cannon: it cannot capture across another piece.",
 "路径畅通，车就能直达。": "With a clear path, the chariot can go straight there.",
 "把红车沿竖线向前移动四格，体会长距离的直线行动。": "Move the Red chariot forward four squares along the file.",
 "马：走日，先看腿": "Horse: Check the leg",
 "先直走一格，再斜走一格；马腿不能被挡。": "Move one square straight, then one diagonally. The first step must be clear.",
 "马的终点与起点组成“日”字：一边两格，另一边一格。": "A horse moves two squares in one direction and one in the other, forming an L.",
 "沿两格方向的第一格就是马腿，有任何棋子都会蹩住。": "The first square in the two-square direction is its leg. Any piece there blocks the move.",
 "红马正前方有兵，向前跳的路线被挡；右侧路线仍然可走。": "The soldier ahead blocks this horse’s forward moves, but its rightward move is open.",
 "目标格是空的，不代表马一定能跳到；还要检查马腿。": "An empty destination is not enough. Check the horse’s leg too.",
 "想好落点，再检查对应的马腿。": "Choose the destination, then check the matching leg square.",
 "红马向右跳日。正前方的兵挡住向前的马腿，但不挡这条路线。": "Jump the Red horse to the right. The soldier blocks its forward leg, but not this route.",
 "炮：隔一子打": "Cannon: One screen",
 "不吃子时像车，吃子时必须隔一枚炮架。": "Move like a chariot when not capturing; jump one screen to capture.",
 "炮不吃子时沿直线移动，路径必须畅通。": "Without a capture, a cannon moves along a clear straight line.",
 "吃子时，炮与目标之间必须恰好有一枚棋子。": "To capture, exactly one piece must stand between cannon and target.",
 "炮架可以是己方棋子，也可以是对方棋子。": "The screen may belong to either player.",
 "没有炮架或有两枚炮架，都不能这样吃子。": "Zero screens or two screens cannot make a legal cannon capture.",
 "开炮之前，先数炮架：恰好一枚。": "Before firing, count the screens: exactly one.",
 "利用中间的红兵作炮架，红炮隔子吃掉黑车。": "Use the Red soldier as a screen to capture the Black chariot.",
 "相：守住自己的半场": "Elephant: Stay on your side",
 "相走田字，不过河，也不能塞相眼。": "Move two squares diagonally, without crossing the river or a blocked midpoint.",
 "相沿斜线走两格，起点与终点组成“田”字。": "An elephant moves exactly two squares diagonally.",
 "田字中央的交叉点是相眼；相眼有棋子就不能走。": "The midpoint is its eye. Any piece there blocks the move.",
 "红相始终留在红方半场，黑象也不能过河。": "Red and Black elephants must each stay on their own side of the river.",
 "相不是远距离斜走的棋子，每次只走一个田字。": "An elephant is not a long-range diagonal piece. It moves only two squares.",
 "走田、看眼、不过河。": "Two diagonally, clear eye, stay behind the river.",
 "把红相飞到中间，相眼畅通，终点仍在己方半场。": "Move the Red elephant toward the center. Its eye is clear and it stays on its own side.",
 "将与士：九宫里的守护": "General and advisor: The palace",
 "将帅直走一步，仕士斜走一步，都留在九宫。": "The general steps straight and advisors step diagonally, always inside the palace.",
 "将帅在九宫中横走或竖走一格，不能走进被攻击的位置。": "The general moves one square horizontally or vertically in the palace and must stay safe.",
 "仕士在九宫内斜走一格，保护将帅周围的要点。": "Advisors move one square diagonally inside the palace to protect key points.",
 "两将不能在同一直线上直接照面；被将军时必须先解将。": "Generals cannot face each other on an open file. You must answer a check.",
 "不能只想着进攻：应将优先，任何一步都不能让自己的将帅受攻击。": "Safety comes first. No move may leave your own general attacked.",
 "将走直，士走斜，活动范围在九宫。": "General straight, advisor diagonal, both inside the palace.",
 "红仕斜上一步，进入九宫中心，为帅提供保护。": "Move the Red advisor diagonally into the palace center to protect the general.",
 "兵：过河就多一种选择": "Soldier: More options across the river",
 "过河前只向前，过河后能横走，始终不能后退。": "Forward before the river; forward or sideways after it. Never backward.",
 "兵卒每次走一格；红兵向棋盘上方前进，黑卒相反。": "Soldiers move one square. Red advances upward and Black advances downward.",
 "过河前只能向前；过河后还可以向左或向右一格。": "Before crossing, move only forward. After crossing, a sideways step is also allowed.",
 "过河兵依然不能后退，也不会像国际象棋一样升变。": "A crossed soldier still cannot retreat and never promotes as in Western chess.",
 "刚走到河边还不能横走，必须进入对方半场。": "Reaching the riverbank is not crossing it. Enter the opponent’s half before moving sideways.",
 "过河增横走，前进不回头。": "Cross the river to gain sideways moves, but never retreat.",
 "红兵向前一步进入对方半场，完成过河。": "Advance the Red soldier into the opponent’s half to cross the river.",
 "黑卒向前一步。演示中的黑方应手也由你操作。": "Move the Black soldier forward. You also play Black’s replies in this demonstration.",
 "过河之后，红兵可以横走一格。": "After crossing the river, the Red soldier can step sideways.",
 "中炮：把火力对准中路": "Central cannon: Aim at the center",
 "认识中炮开局，理解炮架与后续出子的关系。": "See how the central cannon uses a screen and supports development.",
 "中炮是把炮平到中路，利用中兵作炮架向前施压。": "A central cannon moves onto the middle file and uses the central soldier as a screen.",
 "中炮不是立刻就能吃中卒，仍要观察炮架、保护与反击。": "This does not make an immediate capture safe. Check screens, defenders and counterplay.",
 "对手出马后，自己也要发展马车，避免只动一枚炮。": "As your opponent develops a horse, develop your own horses and chariots too.",
 "开局不要执着连续将军；把大子调动出来通常更重要。": "Do not chase repeated checks in the opening. Developing major pieces usually matters more.",
 "炮瞄中路，马车及时出动。": "Aim the cannon at the center, then develop horses and chariots.",
 "红炮平到中路，形成中炮布局。": "Move the Red cannon onto the central file.",
 "黑马正常出动，保护中路并增加活动空间。": "Develop the Black horse to defend the center and gain space.",
 "红马也跳出，形成炮与马的呼应。": "Develop the Red horse to coordinate with the cannon.",
 "双马出动：先站稳，再进攻": "Develop both horses",
 "认识屏风马的基本结构，学会左右协调出子。": "Learn the screen-horse structure and coordinate both wings.",
 "双马分别向中路跳出，可以保护中兵并争取更多控制点。": "Both horses develop toward the center to guard the central soldier and control squares.",
 "这是屏风马结构的基础认识，完整布局还需要结合炮、车和兵。": "This is the basic screen-horse structure. A full opening also involves cannons, chariots and soldiers.",
 "开局要兼顾两翼，少让某一侧的大子一直困在原地。": "Develop both wings instead of leaving major pieces trapped on one side.",
 "出马不是万能防守，仍要看马腿是否被挡、落点是否安全。": "Developing a horse is not a complete defense. Check its leg and destination safety.",
 "左右协调，比一子独进更稳。": "Coordinated wings are stronger than a lone advancing piece.",
 "红方先发展左侧的马，向中路靠拢。": "Develop Red’s left horse toward the center.",
 "黑方平炮到中路，向中兵施压。": "Bring the Black cannon onto the center file to pressure the central soldier.",
 "红方另一匹马也向中路跳出，形成双马呼应的基础结构。": "Develop Red’s other horse toward the center to build a coordinated pair.",
 "出车：先找畅通的路线": "Develop the chariot",
 "认识起横车，练习让车尽早参与棋局。": "Learn a horizontal chariot route to get it into play early.",
 "车起到兵线后方的横线，再横向调动，是一种常见出车方式。": "A common route moves the chariot onto the rank behind the soldiers, then across.",
 "不能为了出车忽略对手的进攻，要先检查将帅和关键子力的安全。": "Do not ignore threats while developing. Check the general and key pieces first.",
 "本课是出车路线示例；实战中也可根据局势选择直车。": "This is one route. A direct chariot development may suit other positions.",
 "车不一定要沿原路直冲；横向调动也能找到好位置。": "The chariot need not charge up its starting file. A horizontal move may find a better square.",
 "找到通路，让大子走出来。": "Find an open route and activate your major pieces.",
 "红车先向前一步，走上可横向活动的路线。": "Move the Red chariot forward one square onto an open rank.",
 "黑卒前进一步，双方轮流行棋。": "Advance the Black soldier. Players alternate moves.",
 "红车沿空横线调到中路，增加活动空间。": "Move the Red chariot across the open rank toward the center.",
 "捉双：将军时顺手攻车": "Fork: Check and attack a chariot",
 "一枚马同时攻击两个目标，利用应将争取吃子机会。": "A horse attacks two targets and uses check to gain a capture.",
 "捉双是一步同时攻击两个重要目标，对手往往难以兼顾。": "A fork attacks two valuable targets at once, often forcing a concession.",
 "如果其中一个目标是将帅，对手必须先应将。": "If one target is the general, your opponent must answer the check first.",
 "将军后不要急着结束计算，要继续看下一步能吃什么。": "Do not stop calculating at check. Look for the capture on the next move.",
 "马能否吃车仍要看马腿；将军也不代表一定赢子。": "Check the horse’s leg before capturing. A check does not always win material.",
 "优先看将军，再看它能否兼攻大子。": "Look for checks that also attack a major piece.",
 "红马跳日，同时将军并攻击右侧黑车。": "Jump the Red horse to check the general and attack the Black chariot.",
 "黑将退到宫内底线，先解除将军。": "Retreat the Black general to the back rank to answer the check.",
 "红马顺势吃车，兑现捉双的收益。": "Capture the Black chariot with the Red horse to complete the fork.",
 "牵制：车后面还有将": "Pin: The general behind the chariot",
 "看穿棋子背后的目标，理解“不能随便走开”。": "Look beyond the target to see why it cannot simply move away.",
 "黑车挡在红车与黑将之间，承担着遮挡攻击的任务。": "The Black chariot stands between the Red chariot and the Black general, blocking the attack.",
 "黑车若横向走开，会暴露黑将，因此行动受到限制。": "A sideways move would expose the general, limiting the Black chariot’s choices.",
 "识别这种牵制后，再考虑吃子、增援或施压。": "After spotting the pin, consider captures, reinforcements and pressure.",
 "被牵制不等于完全不能动；沿原线挡将或吃掉攻击子仍可能合法。": "Pinned does not mean immobile. Moving along the file or capturing the attacker may remain legal.",
 "看目标，也要看目标身后的将帅。": "Look at the target and the general behind it.",
 "红车吃掉同线黑车，同时向黑将发出将军。": "Capture the Black chariot on the same file and check the Black general.",
 "闪将：移开前子，亮出后车": "Discovered check: Open the file",
 "前面的棋子离开，让后方的车直接攻击将帅。": "Move the front piece to uncover the chariot’s attack on the general.",
 "红马暂时挡在红车与黑将之间，黑将尚未被红车攻击。": "The Red horse currently blocks the Red chariot from attacking the Black general.",
 "移开红马，红车的整条线路就被打开。": "Moving the horse opens the entire chariot line.",
 "闪将常可兼顾吃子或占位，本课先认识打开线路的基本形状。": "Discovered checks can also capture or improve position. First learn to recognize the open line.",
 "线路上如果还有其他棋子，移开一子也未必能形成将军。": "If another piece remains on the line, moving one blocker may not give check.",
 "一子移开，另一子的力量才显现。": "Move one piece to reveal another’s power.",
 "红马跳开，后方红车的中路完全畅通，形成闪将。": "Jump the Red horse away, clearing the central file for a discovered chariot check.",
 "交换：把三步都算完": "Exchange: Calculate all three moves",
 "吃子之前，先算清对方回吃和自己的再吃。": "Before capturing, calculate the recapture and your next capture.",
 "眼前吃到一个车，不等于已经赚到一个车。": "Capturing a chariot immediately does not mean you have won a chariot.",
 "沿着“我吃、他吃、我再吃”看完整条变化。": "Follow the full sequence: I capture, they recapture, I capture again.",
 "这里红方以一车换黑方一车一炮，收益来自后续接应。": "Here Red trades one chariot for a chariot and cannon through coordinated support.",
 "不要只数第一步吃到的棋子，要比较整段交换后的结果。": "Compare the final result of the whole exchange, not just the first capture.",
 "先算回吃，再决定要不要吃。": "Calculate the recapture before deciding to capture.",
 "红车先吃黑车，但还没有算完。": "Capture the Black chariot, but keep calculating.",
 "黑炮利用黑卒作炮架，回吃红车。": "The Black cannon uses the soldier as a screen to recapture the Red chariot.",
 "另一辆红车接应吃炮，完成整段交换。": "Red’s other chariot captures the cannon to complete the exchange.",
 "双车错：一车封路，一车将军": "Two chariots: Cover and check",
 "两辆车控制相邻横线，让将帅没有退路。": "Control adjacent ranks so the general has nowhere to escape.",
 "一辆红车控制黑将下方的整条横线，负责封住前进的路。": "One Red chariot controls the rank below the Black general to block forward escapes.",
 "另一辆车切到黑将所在横线发出将军。": "The other chariot reaches the general’s rank to give check.",
 "关键在于两车分工：一个将军，一个封锁逃路。": "Divide the work: one chariot checks while the other covers escape squares.",
 "只把两辆车堆在同一条线上，反而可能相互遮挡。": "Stacking both chariots on the same line can make them block each other.",
 "分开两条线，合起来封住九宫。": "Use two separate lines to seal the palace together.",
 "红车切到底线将军；另一辆红车封住下一横线，形成将死。": "Move the Red chariot to the back rank for check. The other chariot covers the next rank: checkmate.",
 "重炮：两门炮互作炮架": "Double cannon: Mutual screens",
 "两炮同线配合，让对方难以挡将或移动。": "Two cannons on one file make blocking the check difficult.",
 "后炮借前炮作炮架，隔炮攻击黑将。": "The rear cannon uses the front cannon as a screen to attack the Black general.",
 "若黑士到中路挡住后炮，又会变成前炮的炮架。": "If a Black advisor blocks the rear cannon, it becomes a screen for the front cannon.",
 "杀形还依赖逃路被限制；不是所有两炮同线都能将死。": "The escape squares must also be covered. Two aligned cannons alone do not always mate.",
 "两炮必须配合具体位置，先检查将的逃路和双方能否吃炮。": "Check the exact position: escape squares and possible cannon captures still matter.",
 "后炮借前炮，挡一门又通另一门。": "The front cannon screens the rear; a block can activate the front.",
 "后炮平到中路，借前炮将军；黑将无路可走，挡将也无效。": "Bring the rear cannon onto the central file. Black cannot escape or block the check: checkmate.",
 "白脸将：帅也能远程助攻": "Facing generals: Long-range support",
 "利用将帅不能照面的规则，配合车限制逃路。": "Use the no-facing rule to help your chariot cover escape squares.",
 "红帅控制着没有其他棋子的中路，黑将不能走入这条线。": "The Red general controls an open central file that the Black general cannot enter.",
 "红车从侧面切入黑将所在竖线，封住黑将的上下退路。": "The Red chariot attacks from the side and covers the Black general’s vertical escapes.",
 "残局中帅不仅需要保护，也能参与控制关键路线。": "In endgames, the general can help control key routes as well as needing protection.",
 "白脸将依赖中间没有棋子，线路被挡住就不成立。": "This only works on an open file. A piece between the generals changes the position.",
 "将帅不照面，也能变成进攻的力量。": "The no-facing rule can become an attacking resource.",
 "红车对黑将将军。黑将不能前进，也不能向中路走入与红帅照面的线路。": "Check with the Red chariot. Black cannot advance or enter the open file facing the Red general."
});
Object.assign(en,{
'对弈设置':'Game setup','中国象棋棋盘':'Chinese chess board','课程完成进度':'Lesson progress','课程列表':'Lesson list','学习阶段':'Learning stages','棋法演示':'Move demonstration','教学棋盘':'Teaching board','重置当前教学棋盘':'Reset teaching board','服务连接失败，请稍后重试':'Service unavailable. Please try again later.','网络请求失败':'Network request failed','已连接':'Connected','正在重连…':'Reconnecting…','等待好友加入':'Waiting for a friend','红方剩余用时':'Red time remaining','黑方剩余用时':'Black time remaining','创建房间每方用时':'Time per player','房间每方用时':'Time per player','对手提议和棋':'Your opponent offers a draw','登录已过期，请重新登录':'Session expired. Please sign in again.','连接已中断，正在同步棋局':'Connection interrupted. Syncing game…','同步超时，正在核对棋局':'Sync timed out. Checking the game…','提交超时，请稍后重试':'Request timed out. Please retry later.','提交超时，正在核对棋局':'Request timed out. Checking the game…','向对手提议和棋？':'Offer your opponent a draw?','返回联机房间 →':'Return to online room →','邀请房间连接中断':'Invitation connection interrupted','妙棋手 · 邀请你来一局':'Miaoqishou · Join me for a game','点击入座，双方准备后开始对弈。':'Join the room. Play starts when both players are ready.',
'已登录过的账号':'Recent accounts','选择账号':'Choose account','选择已登录账号':'Choose a recent account','记住账号':'Remember account','记住密码':'Remember password','显示密码':'Show password','隐藏密码':'Hide password','使用已保存账号一键登录':'Sign in with a saved account','选择浏览器已保存的密码':'Choose a browser-saved password','密码由浏览器安全保存和自动填充，登录状态保留30天。':'Your browser securely saves and fills passwords. Sign-in lasts 30 days.','请在密码框选择浏览器保存的账号与密码，再点击登录。':'Choose your saved credentials in the password field, then sign in.','还没有可用的已保存密码，请先登录并勾选记住密码。':'No saved password available. Sign in and select Remember password first.','请使用密码框的自动填充入口，或输入密码登录。':'Use password autofill or enter your password to sign in.','你仍可通过浏览器的保存密码提示记住密码。':'You can also use your browser’s save-password prompt.',
'关闭战绩':'Close results','战绩类型':'Result type','分起':'points or more','10分以下':'Below 10 points','积分':'Points','段位与荣誉':'Ranks & Honors','赢 +3 分 · 和 +1 分 · 负 −1 分':'Win +3 · Draw +1 · Loss −1','赢 +3 分，和 +1 分，负 −1 分。':'Win +3 points, draw +1, loss −1.','已获得最高荣誉「棋圣传说」':'Highest honor achieved: Legendary Master','本机存储空间不足，请登录后同步战绩':'Device storage is full. Sign in to sync results.','战绩暂时无法同步':'Results could not sync',
'双方同意和棋':'Draw by agreement','本局由双方同意后结束，最后局面不代表将死。':'Both players agreed to end the game. The final position is not necessarily checkmate.','用时耗尽':'Time expired','最终局面':'Final position','可回放最后一步，查看本局结束时的棋子位置。':'Replay the last move to inspect the final piece positions.','将帅被吃':'General captured','收起结果，查看棋盘':'Close results and view board','最后一步前':'Before the final move','显示最终局面':'Show final position','查看最后一步前':'Before the final move','棋局复盘与分析':'Game review and analysis','关闭复盘':'Close review','回到开局':'Back to opening','本局分析进度':'Analysis progress','本局走法':'Game moves','棋局复盘':'Game review','对局复盘':'Game review','复盘与本局分析 →':'Review and analysis →','每一局，都能走得更好':'Learn something from every game','开局':'Opening','上一步':'Previous','下一步':'Next','最后':'Last','重新分析':'Analyze again','正在分析这一步…':'Analyzing this move…','本局分析已完成':'Analysis complete','基础复盘已就绪':'Basic review ready','开局局面；选择下一步开始回放。':'Opening position. Select Next to replay.','分析暂时不可用，仍可逐步回放。':'Analysis unavailable. You can still replay the game.','分析暂时无法加载；可继续查看最终局面与完整棋谱，或点击重新分析。':'Analysis could not load. Review the final position and moves, or retry.','当前环境未能启动分析；完整回放仍然可用。':'Analysis could not start. Full replay is still available.','棋谱数据不完整，暂时无法复盘':'The move record is incomplete and cannot be replayed','本机对局复盘':'Local game reviews','完成一局棋后，即可在这里回放和分析。':'Finish a game to replay and analyze it here.','本机最近完成的棋局。未保存完整棋谱的旧战绩无法补做复盘。':'Recent games on this device. Older results without complete moves cannot be replayed.','规则复盘与短程推演（最多2半回合），用于发现基础战术问题；建议走法不代表专业棋谱引擎的最优解。棋谱与分析保存在当前浏览器，最近保留30局。':'Rule checks and short searches (up to 2 plies) help identify basic tactical issues. Suggestions are not professional-engine recommendations. The latest 30 games and analyses stay in this browser.',
'先用完本局时间，超时判负。':' ran out of time and lost.','选择认输；最终局面不一定存在将死。':' resigned. The final position may not be checkmate.','的将帅已不在棋盘上。可以回放最后一步，查看攻击路线。':'’s general is no longer on the board. Replay the final move to see the attack.','虽然没有被将军，但已无任何合法走法，按象棋规则判负。':' has no legal move despite not being in check and loses by Xiangqi rules.','正在将军；':' is giving check; ','当前正在被将军；':'The general is in check; ','所有棋子均无合法解将走法，因此被将死。':' has no legal way to answer the check: checkmate.','被己方棋子占据':' is occupied by a friendly piece','后仍被将军':' still leaves the general in check','移至':'Moving to ','：短程推演中，这步放弃了更有利的选择。':': a short search found a stronger option.','：对手已无合法解将走法。':': your opponent has no legal reply to check.','：这步对对方将帅形成直接威胁。':': this move directly threatens the opposing general.','：当前短程搜索未发现明显的子力损失。':': the short search found no clear material loss.','待改进':'Needs improvement','好棋':'Good move','稳健':'Solid','失误':'Mistake','重大失误':'Blunder','将军':'Check','吃子':'Capture','同屏':'Local','对弈':'Game','暂无走法':'No move available',
'先点选要移动的棋子，再点击落点。':'Select a piece first, then a destination.','这一步不符合走棋规则，棋盘保持原样。请检查路线、马腿、炮架或将帅安全。':'Illegal move. Check the path, horse leg, cannon screen and general safety.','这步可以走，但不是本课的示范路线。再想想：':'Legal move, but not this lesson’s sequence. Think again: ','已选择':'Selected ','，请选择落点。':'. Choose a destination.'
});
Object.assign(en,{'每一局，都算数。':'Every game counts.','人机战绩':'Computer results','联机战绩':'Online results','胜 +3 分 · 和 +1 分 · 负 −1 分 · 每局仅结算一次':'Win +3 · Draw +1 · Loss −1 · Each game is scored once','刷新战绩':'Refresh results','查看更多':'View more','段位与荣誉称号':'Ranks and honors','空位':'Empty square'});
const parts=Object.keys(en).filter(k=>k.length>1).sort((a,b)=>b.length-a.length);
function english(value){
 if(Object.hasOwn(en,value))return en[value];
 let text=value;
 text=text.replace(/^(红方|黑方)确认认输？$/,(_,side)=>`Resign as ${en[side]}?`)
 .replace(/^第\s*(\d+)\s*回合$/,'Turn $1')
 .replace(/^已完成 (\d+) \/ (\d+) 课$/,'Completed $1 / $2 lessons')
 .replace(/^第 (\d+) 课 · 约 (\d+) 分钟$/,'Lesson $1 · About $2 min')
 .replace(/^山隐正在凝思（最多约([\d.]+)秒）…$/,'Shanyin is thinking (up to about $1 s)…')
 .replace(/^高清棋子加载中 · (\d+)\/(\d+)$/,'Loading detailed pieces · $1/$2')
 .replace(/^(\d+)分钟$/,'$1 min')
 .replace(/^房间 ([A-F0-9]{8})$/,'Room $1')
 .replace(/^房间 ([A-F0-9]{8}) · 你执(红|黑)$/,(_,code,side)=>`Room ${code} · You play ${side==='红'?'Red':'Black'}`)
 .replace(/^(红方|黑方)已连续将军 (\d+) 回合，请变换走法，勿反复长将。$/,(_,s,n)=>`${en[s]} has checked ${n} times in a row. Choose a different move.`)
 .replace(/^(红方|黑方)已连续 (\d+) 回合将军，不能一直用相同的步骤进行长将，请变换走法。$/,(_,s,n)=>`${en[s]} has checked ${n} times in a row. Please change your play.`)
 .replace(/^(红方|黑方)用时耗尽，超时判负$/,(_,s)=>`${en[s]} ran out of time and lost.`)
 .replace(/^胜率 (\d+)%$/,'Win rate $1%')
 .replace(/联机 · 每方 (\d+) 分钟/g,'Online · $1 min per player')
 .replace(/^距「(.+)」还需 (\d+) 分$/,(_,title,n)=>`${n} points to ${en[title]||title}`)
 .replace(/^(.+)段$/,(_,rank)=>en[rank]?`${en[rank]} rank`:`${rank}段`)
 .replace(/^(\d+)分起$/,'From $1 points')
 .replace(/^正在逐步分析… (\d+) \/ (\d+)$/,'Analyzing… $1 / $2')
 .replace(/^(红|黑)([帅帥将將车車马馬炮砲兵卒相象仕士]) (?=\d+列)/,(_,side,p)=>`${side==='红'?'Red':'Black'} ${pieceNames[p]} `)
 .replace(/^空位 (?=\d+列)/,'Empty square ')
 .replace(/(\d+)列(\d+)行/g,'file $1, rank $2')
 .replace(/^第(\d+)步 · /,'Move $1 · ');
 if(!/[\u3400-\u9fff]/.test(text))return text;
 // Only compose known UI fragments, never translate arbitrary names or input values.
 if(text.includes(' · ')||/^Level \d+/.test(text)||text.startsWith('已切换为')||/^(红方|黑方|移至|当前正在被将军；|已选择|这步可以走)/.test(text)||text.startsWith('下一步：')||text.startsWith('轮到你：')){
  text=text.replace(/^下一步：/,'Next: ').replace(/^轮到你：/,'Your turn: ');
  for(const k of parts)text=text.split(k).join(en[k]);
  text=text.replace(/^已切换为/,'Selected: ').replace(/^下一步：/,'Next: ').replace(/^轮到你：/,'Your turn: ').replace(/(\d+) 回合/g,'$1 turns').replace(/段$/,' rank');
 }
 return text;
}
const es=window.MQSpanish||{};
const esParts=Object.keys(es).filter(k=>k.length>1).sort((a,b)=>b.length-a.length);
const esPieceNames={'帅':'General','帥':'General','将':'General','將':'General','车':'Carro','車':'Carro','马':'Caballo','馬':'Caballo','炮':'Cañón','砲':'Cañón','兵':'Soldado','卒':'Soldado','相':'Elefante','象':'Elefante','仕':'Consejero','士':'Consejero'};
function spanish(value){
 if(Object.hasOwn(es,value))return es[value];
 let text=value;
 text=text.replace(/^(红方|黑方)确认认输？$/,(_,side)=>`¿Rendirse con ${side==='红方'?'rojas':'negras'}?`)
 .replace(/^第\s*(\d+)\s*回合$/,'Turno $1')
 .replace(/^已完成 (\d+) \/ (\d+) 课$/,'Completadas $1 / $2 lecciones')
 .replace(/^第 (\d+) 课 · 约 (\d+) 分钟$/,'Lección $1 · Unos $2 min')
 .replace(/^山隐正在凝思（最多约([\d.]+)秒）…$/,(_,n)=>`Shanyin está pensando (hasta unos ${n.replace('.',',')} s)…`)
 .replace(/^高清棋子加载中 · (\d+)\/(\d+)$/,'Cargando piezas detalladas · $1/$2')
 .replace(/^(\d+)分钟$/,'$1 min')
 .replace(/^房间 ([A-F0-9]{8})$/,'Sala $1')
 .replace(/^房间 ([A-F0-9]{8}) · 你执(红|黑)$/,(_,code,side)=>`Sala ${code} · Juegas con ${side==='红'?'rojas':'negras'}`)
 .replace(/^(红方|黑方)已连续将军 (\d+) 回合，请变换走法，勿反复长将。$/,(_,s,n)=>`Las ${s==='红方'?'rojas':'negras'} han dado jaque ${n} veces seguidas. Cambia de jugada.`)
 .replace(/^(红方|黑方)已连续 (\d+) 回合将军，不能一直用相同的步骤进行长将，请变换走法。$/,(_,s,n)=>`Las ${s==='红方'?'rojas':'negras'} han dado jaque ${n} veces seguidas. Cambia de jugada.`)
 .replace(/^(红方|黑方)用时耗尽，超时判负$/,(_,s)=>`Las ${s==='红方'?'rojas':'negras'} agotaron su tiempo y perdieron.`)
 .replace(/^胜率 (\d+)%$/,'Victorias $1 %')
 .replace(/联机 · 每方 (\d+) 分钟/g,'En línea · $1 min por jugador')
 .replace(/^距「(.+)」还需 (\d+) 分$/,(_,title,n)=>`${n} puntos para ${es[title]||title}`)
 .replace(/^(.+)段$/,(_,rank)=>es[rank]?`Rango ${es[rank]}`:`${rank}段`)
 .replace(/^(\d+)分起$/,'Desde $1 puntos')
 .replace(/^正在逐步分析… (\d+) \/ (\d+)$/,'Analizando… $1 / $2')
 .replace(/^(红|黑)([帅帥将將车車马馬炮砲兵卒相象仕士]) (?=\d+列)/,(_,side,p)=>`${esPieceNames[p]} ${side==='红'?'rojo':'negro'} `)
 .replace(/^空位 (?=\d+列)/,'Intersección vacía ')
 .replace(/^落子至 (\d+)列(\d+)行$/,'Mover a columna $1, fila $2')
 .replace(/(\d+)列(\d+)行/g,'columna $1, fila $2')
 .replace(/^第(\d+)步 · /,'Jugada $1 · ');
 if(!/[\u3400-\u9fff]/.test(text))return text;
 if(text.includes(' · ')||/^Level \d+/.test(text)||text.startsWith('已切换为')||/^(红方|黑方|移至|当前正在被将军；|已选择|这步可以走)/.test(text)||text.startsWith('下一步：')||text.startsWith('轮到你：')){
  text=text.replace(/^下一步：/,'Siguiente: ').replace(/^轮到你：/,'Tu turno: ');
  for(const k of esParts)text=text.split(k).join(es[k]);
  text=text.replace(/^已切换为/,'Seleccionado: ').replace(/(\d+) 回合/g,'$1 turnos').replace(/段$/,' (rango)').replace(/^Level /,'Nivel ');
 }
 return text;
}
function localized(value){return language==='es'?spanish(value):english(value)}
const originals=new WeakMap(),attributes=new WeakMap();
const excluded='script,style,textarea,[data-no-i18n],.piece-fallback,.piece-artwork,.initial-piece,#avatarLetter,.prep-name,.mq-code-preview,.invite-link,#history';
function skip(el){return !el||!!el.closest(excluded)}
function localizeText(node){
 const el=node.parentElement;if(skip(el)||el.closest('svg'))return;
 const current=node.nodeValue,previous=originals.get(node);
 const source=previous&&current===previous.rendered?previous.source:current;
 const trimmed=source.trim();if(!trimmed)return;
 const rendered=language==='zh-CN'?source:source.replace(trimmed,localized(trimmed));
 originals.set(node,{source,rendered});if(rendered!==current)node.nodeValue=rendered;
}
function localizeAttributes(el){
 if(skip(el))return;
 let saved=attributes.get(el);if(!saved){saved={};attributes.set(el,saved)}
 for(const name of ['aria-label','title','placeholder','alt']){
  if(!el.hasAttribute(name))continue;
  const current=el.getAttribute(name),old=saved[name],source=old&&current===old.rendered?old.source:current;
  let rendered=language==='zh-CN'?source:localized(source);
  if(language==='en'){
   rendered=rendered.replace(/^(红|黑)([帅帥将將车車马馬炮砲兵卒相象仕士]) (\d+)列(\d+)行$/,(_,side,p,x,y)=>`${side==='红'?'Red':'Black'} ${pieceNames[p]} · file ${x}, rank ${y}`)
    .replace(/^落子至 (\d+)列(\d+)行$/,'Move to file $1, rank $2');
  }
  saved[name]={source,rendered};if(rendered!==current)el.setAttribute(name,rendered);
 }
}
const pieceNames={'帅':'General','帥':'General','将':'General','將':'General','车':'Chariot','車':'Chariot','马':'Horse','馬':'Horse','炮':'Cannon','砲':'Cannon','兵':'Soldier','卒':'Soldier','相':'Elephant','象':'Elephant','仕':'Advisor','士':'Advisor'};
function translate(root){
 if(root.nodeType===3){localizeText(root);return}
 if(root.nodeType!==1||skip(root))return;
 localizeAttributes(root);
 for(const el of root.querySelectorAll('[aria-label],[title],[placeholder],[alt]'))localizeAttributes(el);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))localizeText(node);
}
const observer=new MutationObserver(records=>{
 observer.disconnect();
 for(const record of records){
  if(record.type==='characterData')localizeText(record.target);
  else if(record.type==='attributes')localizeAttributes(record.target);
  else for(const node of record.addedNodes)translate(node);
 }
 observe();
});
function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']})}
const chineseTitle=document.title;
function setLanguage(value,persist=true){
 if(!supported.includes(value))return;
 language=value;if(persist)try{localStorage.setItem(KEY,value)}catch{}
 observer.disconnect();document.documentElement.lang=value;document.body.dataset.language=value;
 document.title=value==='zh-CN'?chineseTitle:localized(chineseTitle);
 translate(document.body);
 const select=document.getElementById('languageSetting');if(select)select.value=value;
 observe();window.dispatchEvent(new CustomEvent('mq-language',{detail:{language:value}}));
}
window.MQI18n={get language(){return language},t:value=>language==='zh-CN'?String(value):localized(String(value)),setLanguage,translate,source:el=>Array.from(el.childNodes,n=>n.nodeType===3?(originals.get(n)?.source??n.nodeValue):n.textContent).join('')};
function init(){document.getElementById('languageSetting')?.addEventListener('change',e=>setLanguage(e.target.value));setLanguage(language,false)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

