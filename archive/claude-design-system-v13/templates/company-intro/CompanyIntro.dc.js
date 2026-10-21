class Component extends DCLogic {
  renderVals() {
    const p = this.props;
    const showTimelines = p.showTimelines ?? true;
    const highlightModule = p.highlightModule ?? -1;

    // ── 服务模块: one entry per module → ModuleDetailSlide + TimelineSlide. Add a module by adding an entry.
    const days = (list) => list.map((d) => ({ at: d, label: d + " 日" }));
    const MODULES = [
      { key: "新店开业", image: "deck/module-1.jpg", title: "新店可研与开业督导", aim: "算清店址与投资，陪跑开业后 90 天。",
        detail: { subtitle: "确定店址的新店可行性研究、开业经营设计与试运营督导。",
          stats: [{ value: "42", unit: "日", label: "前期研究" }, { value: "90", unit: "天", label: "开业后督导" }],
          steps: [{ title: "店址与商圈洞察", body: "项目条件、商圈需求与竞争格局，确定门店定位。" }, { title: "投资可行性测算", body: "36 个月现金流模型，测算盈亏平衡与回收期。" }, { title: "开业经营方案", body: "开业菜单、价格套餐、餐位收益与菜单展示。" }, { title: "试运营复盘校准", body: "开业数据周月复盘，修订经营爬坡与现金流。" }],
          deliverables: [{ k: "新店可行性报告", v: "1 份" }, { k: "投资现金流模型", v: "36 个月" }, { k: "开业经营方案", v: "1 套" }, { k: "开业周报与月度复盘", v: "90 天" }] },
        timeline: { title: "签约至开业后 90 天", note: "开业经营方案为开业前第 21—42 日；排期以签约后第 60 日开业为参考，最终按实际开业时间顺延。",
          axis: { min: 0, max: 180, ticks: days([0, 30, 60, 90, 120, 150, 180]) }, markers: [{ at: 60, label: "开业（参考第 60 日）" }],
          rows: [{ label: "店址与商圈洞察", from: 0, to: 21, out: "店址洞察与定位初稿" }, { label: "投资可行性与财务测算", from: 10, to: 40, out: "可行性报告与现金流模型初稿" }, { label: "开业经营方案", from: 18, to: 60, out: "开业经营方案与模型修订稿" }, { label: "首月复盘与调整", from: 60, to: 90, out: "开业首月复盘与调整建议" }, { label: "月度复盘与模型修订", from: 90, to: 150, out: "修订模型与阶段总结" }] } },
      { key: "概念开创", image: "deck/module-2.jpg", title: "定位概念开创与产品价值创新", aim: "找准场景、主打产品与商业模式。",
        detail: { subtitle: "餐饮新概念、菜单价值重构与复合业态的经营设计及创新督导。",
          stats: [{ value: "12", unit: "周", label: "首轮周期" }, { value: "3", unit: "期", label: "阶段成果" }],
          steps: [{ title: "需求洞察与概念定位", body: "消费场景与资源评估，确定主概念与商业模式。" }, { title: "产品体验与经营模型", body: "菜单架构、后厨档口排布与分业态测算。" }, { title: "试行督导与发展规划", body: "试行方案落地，复盘表现，形成发展路线。" }],
          deliverables: [{ k: "创新研究与主方向方案", v: "1 套" }, { k: "菜单与体验经营方案", v: "1 套" }, { k: "分业态现金流模型", v: "12 个月" }, { k: "周度进展与阶段总结", v: "3 期" }] },
        timeline: { title: "首轮 12 周，三期成果", note: "以签约日为起点，结合场地、产品准备及试行进度滚动调整；后厨排布于场地确定后推进。",
          axis: { min: 0, max: 84, ticks: days([0, 14, 28, 42, 56, 70, 84]) }, markers: [], phases: [{ from: 0, to: 28, label: "第一期" }, { from: 28, to: 56, label: "第二期" }, { from: 56, to: 84, label: "第三期" }],
          rows: [{ label: "需求洞察与候选方向", from: 0, to: 14, out: "需求洞察与候选方向" }, { label: "主概念与商业模式", from: 10, to: 28, out: "主方向方案与模型初版" }, { label: "菜单架构与产品创新", from: 28, to: 49, out: "菜单与体验经营方案" }, { label: "后厨排布与经营模型", from: 35, to: 56, out: "后厨模型深化与试行方案" }, { label: "试行指导与复盘", from: 56, to: 77, out: "试行复盘与方案修订" }, { label: "阶段评估与发展规划", from: 70, to: 84, out: "后续发展计划" }] } },
      { key: "经营复盘", image: "deck/module-3.jpg", title: "餐饮经营复盘与优化", aim: "按周月复盘，调整菜单与产品。",
        detail: { subtitle: "在营餐厅经营复盘、菜单优化与收益改善。",
          stats: [{ value: "90", unit: "天", label: "标准首期" }, { value: "周 · 月", label: "复盘节奏" }],
          steps: [{ title: "经营与市场洞察", body: "业绩诊断、商圈竞争与获客，测算盈利结构。" }, { title: "菜单与产品组合", body: "品类与主力产品、上下架、新品与价格带。" }, { title: "交易转化与效率", body: "套餐连带、餐段与空间效率、菜单表达。" }, { title: "实施与持续复盘", body: "明确重点动作，按执行反馈更新下期计划。" }],
          deliverables: [{ k: "经营复盘与菜单方案", v: "1 套" }, { k: "经营测算模型", v: "1 套" }, { k: "经营快报与月度复盘", v: "周 · 月" }, { k: "阶段总结与后续计划", v: "1 套" }] },
        timeline: { title: "先诊断，再改菜单，按月复盘", note: "新菜单落地时间按签约后第 35 日参考绘制；实际随项目资料及实施进度滚动调整。",
          axis: { min: 0, max: 120, ticks: days([0, 30, 60, 90, 120]) }, markers: [{ at: 35, label: "新菜单落地（参考）" }],
          rows: [{ label: "经营表现与市场洞察", from: 0, to: 15, out: "诊断初稿与优先改善清单" }, { label: "菜单定位与产品组合", from: 10, to: 35, out: "首轮菜单及产品优化方案" }, { label: "交易转化与运营效率", from: 30, to: 60, out: "交易转化与门店效率建议" }, { label: "落地后第 2 个月复盘", from: 65, to: 95, out: "模型可用版与阶段复盘" }, { label: "落地后第 3 个月复盘", from: 95, to: 120, out: "阶段总结与后续优化计划" }] } },
      { key: "连锁督导", image: "deck/module-4.jpg", title: "连锁规模化运营督导", aim: "10 店以上连锁的总部督导与跨店复制。",
        detail: { subtitle: "餐饮及烘焙连锁的多店经营分析、总部督导与标准化运营。",
          stats: [{ value: "12", unit: "个月", label: "标准首年" }, { value: "10", unit: "店+", label: "重点适用" }],
          steps: [{ title: "总部数据体系", body: "店型分层、经营看板，识别偏差与重点门店。" }, { title: "菜单标准与适配", body: "品牌一致的品类结构，区域定价与渠道。" }, { title: "督导与规模复制", body: "新品推广、展陈与顾客经营，跨店复制。" }, { title: "收益模型与规划", body: "现金流与店型效率模型，年度规划。" }],
          deliverables: [{ k: "经营工作空间与看板", v: "1 套" }, { k: "周快报 · 月报", v: "52 + 12 期" }, { k: "季度复盘 · 业务模型", v: "4 期 · 2 套" }, { k: "年度规划与督导体系", v: "1 套" }] },
        timeline: { title: "首年 12 个月，四次季度复盘", note: "以签约日为起点；第 3、6、9、12 个月开展季度复盘，周月成果贯穿全年。",
          axis: { min: 0, max: 12, ticks: [0, 2, 4, 6, 8, 10, 12].map((m) => ({ at: m, label: m + " 月" })) }, markers: [], phases: [{ from: 0, to: 3, label: "Q1" }, { from: 3, to: 6, label: "Q2" }, { from: 6, to: 9, label: "Q3" }, { from: 9, to: 12, label: "Q4" }],
          rows: [{ label: "门店分层与督导重点", from: 0, to: 1.5, out: "门店分层与年度督导重点" }, { label: "经营基线与看板配置", from: 1, to: 3, out: "工作空间与看板可用版" }, { label: "菜单标准与区域适配", from: 2.5, to: 5, out: "品牌及店型菜单、区域定价" }, { label: "经营与店型效率模型", from: 3.5, to: 6, out: "两类经营模型初版" }, { label: "新品试行与重点门店", from: 6, to: 8, out: "半年复盘与模型可用版" }, { label: "区域适配与跨店推广", from: 7.5, to: 9.5, out: "跨店推广方案与九个月复盘" }, { label: "年度回顾与次年规划", from: 10, to: 12, out: "年度规划与督导体系" }] } }
    ];

    // ── 伙伴案例: one entry per case → CaseStudySlide. The index slide reads `summary`.
    const CASES = [
      { name: "石头先生", image: "deck/case-01.jpg", logo: "logos/shitou.png", module: "模块一 · 新店开业支持", summary: "新店开业运营决策效率提升 5 倍，制定 30+ 项可直接提升收益的策略。",
        sub: "北京合生汇首店 → 五棵松第二家店", headline: "开业运营决策效率提升 5 倍，制定 30+ 项可直接提升收益的策略。",
        meta: [{ k: "业态", v: "汉堡" }, { k: "地点", v: "北京 · 合生汇首店 / 五棵松店" }],
        background: "石头先生的汉堡在北京合生汇开出首店，第二家店随后落位五棵松。两处商圈的客群结构、消费时段与竞争品牌差异明显，首店打法不能直接复制。",
        challenges: ["新商圈客群与竞品情况不清楚", "开业期决策多、节奏快，依赖经验判断", "空间动线要与出品和客流匹配"],
        approach: [{ title: "首店落地陪跑", body: "建立开业期关键指标与复盘节奏" }, { title: "五棵松竞争圈研判", body: "梳理新客群与竞品，完成定位适配" }, { title: "平面图分析", body: "校对点单、出品与就餐动线" }, { title: "订单级流水分析", body: "按单拆解时段、客单与菜品组合" }],
        results: [{ value: "5×", label: "开业运营决策效率" }, { value: "30+", label: "多维度收益策略" }, { value: "2", label: "家门店 · 首店与第二家店" }],
        deliverables: ["竞争圈与客群分析", "平面图动线诊断", "订单级流水分析", "30+ 项收益策略清单"] },
      { name: "清水亭", image: "deck/case-02.jpg", logo: "logos/qingshuiting.png", module: "模块三 · 经营复盘", summary: "订单级复盘历史经营数据，重新梳理湖北菜定位与菜单战略。",
        sub: "北京 · 湖北菜门店", headline: "重新梳理定位，给出未来发展的菜系与菜单战略建议。",
        meta: [{ k: "业态", v: "湖北菜" }, { k: "地点", v: "北京" }],
        background: "清水亭是北京的湖北菜门店，已积累一段时间的历史经营数据。周边竞争加剧，需要用数据重新看清自身优势，判断下一阶段的定位与菜系方向。",
        challenges: ["定位在经营中逐渐模糊，湖北菜特色未被放大", "历史数据停留在月度汇总，看不到单品与时段", "菜系扩展方向缺少数据依据"],
        approach: [{ title: "订单级数据还原", body: "把历史流水拆到每一单、每道菜、每个时段" }, { title: "菜品贡献分析", body: "按销量、毛利与搭配评估招牌与长尾" }, { title: "竞争格局对照", body: "对照北京同类门店的定位、价格带与菜单" }, { title: "战略建议", body: "输出定位、菜系方向与菜单结构建议" }],
        results: [{ value: "订单级", label: "历史数据分析颗粒度" }, { value: "定位", label: "湖北菜定位重新梳理" }, { value: "战略", label: "菜系与菜单发展建议" }],
        deliverables: ["订单级历史经营复盘", "菜品贡献与结构分析", "北京竞争格局对照", "菜系与菜单战略建议"] },
      { name: "石头先生", image: "deck/case-03.jpg", logo: "logos/shitou.png", module: "模块四 · 连锁督导", summary: "为近 100 家门店建立督导智能系统，支持供应链、营销、运营与投资决策。",
        sub: "烘焙 + 汉堡 · 近 100 家门店", headline: "为近 100 家门店建立餐饮第二大脑督导智能系统。",
        meta: [{ k: "业态", v: "烘焙 + 汉堡" }, { k: "地点", v: "近 100 家门店" }],
        background: "石头先生旗下烘焙与汉堡门店近 100 家。门店数据分散在不同系统，总部靠人工汇总，督导与决策的时效和一致性受限。",
        challenges: ["多门店、多业态数据口径不一", "人工导出整理耗时", "各部门需要同一份可核对的数据"],
        approach: [{ title: "自动数据导出", body: "对接门店经营数据，按周期自动导出" }, { title: "梳理清洗", body: "统一门店、菜品、时段口径，处理缺失与异常" }, { title: "标注分析", body: "按业态、商圈、时段对比门店与菜品" }, { title: "决策支持", body: "按供应链、营销、运营、投资四类场景输出结论" }],
        results: [{ value: "近 100", label: "家门店接入" }, { value: "2", label: "类业态 · 烘焙与汉堡" }, { value: "4", label: "类决策 · 供应链 营销 运营 投资" }],
        deliverables: ["餐饮第二大脑督导系统", "多门店经营看板", "标准化数据口径", "分场景决策简报"] },
      { name: "苏帮袁", image: "deck/case-04.jpg", logo: "logos/subangyuan.png", module: "模块三 · 经营复盘", summary: "每月订单级复盘 9 家淮扬 · 江浙菜门店，协助优化菜单与复购策略。",
        sub: "9 家门店 · 按月复盘", headline: "每月复盘 9 家门店，协助优化整体菜单与复购策略。",
        meta: [{ k: "业态", v: "淮扬菜 · 江浙菜" }, { k: "地点", v: "9 家门店" }],
        background: "苏帮袁经营淮扬菜与江浙菜，旗下 9 家门店客群与销量表现各不相同。需要一套按月运行、口径统一的复盘机制，让管理层每月都能拿到可比较的结论。",
        challenges: ["9 家门店口径不一，横向难比较", "月度数据多，人工整理慢、洞察浅", "复购缺少持续追踪，菜单调整难验证"],
        approach: [{ title: "月度销量拆解", body: "拆解每店每菜每时段的销量与客单" }, { title: "消费者洞察", body: "客群结构、点单偏好与客单分层" }, { title: "复购率分析", body: "定位影响复购的菜品与环节" }, { title: "菜单与复购策略", body: "输出建议，次月复盘验证效果" }],
        results: [{ value: "9", label: "家门店 · 统一口径按月复盘" }, { value: "三维", label: "门店 × 菜品 × 时段" }, { value: "3", label: "项分析 · 销量 洞察 复购" }],
        deliverables: ["月度经营复盘报告", "9 店横向对比看板", "消费者与复购分析", "菜单与复购优化建议"] },
      { name: "潮发", image: "deck/case-05.jpg", logo: "logos/chaofa.png", module: "模块二 · 概念开创", summary: "在开放式厨房展陈与运营动线上做概念创新，优化展示模式。",
        sub: "新店 · 开放式厨房", headline: "在开放式厨房展陈与运营动线上做概念创新。",
        meta: [{ k: "业态", v: "新店 · 开放式厨房" }, { k: "地点", v: "新店" }],
        background: "潮发新店采用开放式厨房。厨房既是出品空间，也是顾客进店后最先看到的品牌展示。",
        challenges: ["展陈效果与出品效率需要兼顾", "顾客动线与员工动线容易交叉", "展示需要讲清品牌与食材"],
        approach: [{ title: "概念梳理", body: "提炼新店要传达的品牌与食材卖点" }, { title: "展陈规划", body: "规划展示位、陈列方式与视线焦点" }, { title: "动线优化", body: "梳理备餐、出品、传菜与顾客动线" }, { title: "展示模式优化", body: "让展示与点单、出品节奏结合" }],
        results: [{ value: "展陈", label: "开放式厨房展示方案" }, { value: "动线", label: "备餐 出品 传菜梳理" }, { value: "展示", label: "模式优化与概念创新" }],
        deliverables: ["新店概念方案", "开放式厨房展陈方案", "运营动线优化建议", "展示模式方案"] },
      { name: "游园京梦", image: "deck/case-06.jpg", logo: "logos/youyuanjingmeng.png", module: "模块三 · 经营复盘", summary: "阶段性订单级洞察淮扬菜菜单，给出上下架分析与优化建议。",
        sub: "淮扬菜 · 阶段性复盘", headline: "用订单级洞察，决定菜单上什么、下什么。",
        meta: [{ k: "业态", v: "淮扬菜" }, { k: "地点", v: "阶段性复盘" }],
        background: "游园京梦经营淮扬菜，需要在阶段节点复盘菜单：哪些菜保留、调整或下架，哪些新品值得上架。过去的判断主要依赖销量排名与经验。",
        challenges: ["只看销量排名，看不出单品真实贡献", "上新与下架依赖经验，决策周期长", "调整之后缺少数据验证"],
        approach: [{ title: "订单级数据梳理", body: "还原点单组合与时段分布" }, { title: "菜品四象限评估", body: "按销量、毛利、搭配带动与复点率评估" }, { title: "上下架分析", body: "给出保留、调整、下架与上新清单" }, { title: "阶段复盘", body: "跟踪调整后的表现，进入下一轮" }],
        results: [{ value: "订单级", label: "每一单每一道菜" }, { value: "4", label: "维评估 · 销量 毛利 搭配 复点" }, { value: "上下架", label: "菜单调整建议清单" }],
        deliverables: ["阶段性订单级洞察", "菜品四象限评估", "菜单上下架建议清单", "调整效果跟踪"] },
      { name: "韵1980淮扬菜", image: "deck/case-07.jpg", logo: "logos/yun1980.png", module: "模块一 · 新店开业支持", summary: "分析本地客群与竞争圈，完成淮扬菜新店的适配与落地支持。",
        sub: "广东 · 珠江啤酒产业园", headline: "让淮扬菜新店适配本地客群与竞争圈，完成落地。",
        meta: [{ k: "业态", v: "淮扬菜" }, { k: "地点", v: "广东 · 珠江啤酒产业园" }],
        background: "韵1980 将淮扬菜新店开在广东珠江啤酒产业园。菜系进入新的地域市场，需要重新理解本地客群与竞争环境。",
        challenges: ["本地客群口味与消费习惯不同", "园区周边竞争与客流结构不清楚", "菜单与价格需要本地化"],
        approach: [{ title: "本地客群分析", body: "园区及周边客群构成、场景与时段" }, { title: "竞争圈分析", body: "周边业态、价格带与主力竞品" }, { title: "定位与菜单适配", body: "保留淮扬特色，调整菜单结构与价格" }, { title: "落地支持", body: "配合开业筹备与开业期运营" }],
        results: [{ value: "客群", label: "本地客群适配" }, { value: "竞争圈", label: "周边业态与价格带" }, { value: "落地", label: "新店开业支持" }],
        deliverables: ["本地客群分析", "竞争圈分析报告", "菜单与价格适配建议", "开业落地支持"] },
      { name: "吴裕泰", image: "deck/case-08.jpg", logo: "logos/wuyutai.png", module: "营销支持", summary: "为新店奶茶提供概念图营销生成支持。",
        sub: "茶饮 · 新店奶茶", headline: "为新店奶茶生成营销概念图。",
        meta: [{ k: "业态", v: "茶饮 · 新店奶茶" }, { k: "地点", v: "新店" }],
        background: "吴裕泰新店推出奶茶产品，上市前需要一批可用于营销宣传的概念视觉。",
        challenges: ["上市节奏紧，传统拍摄周期长", "视觉要体现茶底与品牌调性", "需要多个方向供选择"],
        approach: [{ title: "产品概念梳理", body: "提炼茶底、口感与品牌卖点" }, { title: "视觉方向设定", body: "确定画面风格、场景与色调" }, { title: "AI 概念图生成", body: "批量生成多个方向的营销概念图" }, { title: "筛选与交付", body: "与团队共同筛选，交付可用图稿" }],
        results: [{ value: "概念图", label: "AI 营销视觉生成" }, { value: "多方向", label: "视觉方案供选择" }, { value: "新店", label: "奶茶上市营销" }],
        deliverables: ["产品概念梳理", "视觉方向", "营销概念图组", "新店营销素材"] }
    ];

    // ── 团队: one entry per person → roster seat + ProfileSlide. Invite an expert by adding an entry
    // (photo: a path inside the DS assets/ folder, a URL, or omit for a placeholder).
    const PEOPLE = [
      { group: "联合创始人", name: "边江", latin: "BIAN JIANG", photo: "people/bianjiang.png",
        seat: { title: "联合创始人 · 前海底捞品牌负责人", field: "品牌定位 · 菜单咨询" },
        roles: ["侍天联合创始人", "前海底捞品牌负责人", "前勺子餐饮 CEO", "尖味菜单工作室创始人"],
        bio: "北京大学经济学出身。先后在新浪、网易做品牌传播 6 年，在呷哺呷哺、海底捞做品牌 5 年，之后创立羽生餐饮品牌管理公司，长期负责品牌定位、产品结构与菜单咨询，以全案方式介入项目。",
        highlights: ["全案服务 100 多个餐饮品牌，中国餐饮 TOP50 占比 60%", "服务海底捞、新辣道、东来顺、探鱼、奈雪的茶、蔡澜点心等", "东来顺：整体单均销售 +24%", "蒸小皖：销售同比 +58%，小笼系列占比 50%", "杯子红：午餐人流 +20%", "方向性、系统性、落地性，三项原则做全案"] },
      { group: "联合创始人", name: "郭峰", latin: "GUO FENG", photo: "people/guofeng.png",
        seat: { title: "联合创始人 · EHL 大中华区创始团队", field: "组织能力 · AI 应用" },
        roles: ["侍天联合创始人", "瑞士 EHL 大中华区创始团队成员", "中智游集团 AI 应用合伙人", "微软深圳出海中心 AI 合伙人"],
        bio: "EHL（瑞士洛桑酒店管理学院）是 QS 酒店与休闲管理学科全球排名第一的学府。郭峰作为大中华区创始团队成员，参与 EHL 在华业务从 0 到 1 落地，熟悉国际酒店、餐饮与文旅投资及米其林餐饮体系，现专注 AI 在餐饮经营中的应用落地。",
        highlights: ["EHL 在华业务从 0 到 1，延伸至欧洲、中东、非洲", "为跨国企业及国央企 CXO 提供 20+ 场定制化教练式培训", "主讲 10+ 场高校师资教练课程", "TABLE AI 创始合伙人、董事长", "OPC Global 理事会秘书长", "原创 L.I.D. 体系，主导 OPC+X 国际教练认证"] },
      { group: "专家团", name: "李权超", latin: "LI QUANCHAO", photo: "people/liquanchao.png",
        seat: { title: "餐饮出品专家 · 中式烹调高级技师", field: "菜品研发 · 出品标准" },
        roles: ["餐饮出品专家", "国家中式烹调高级技师", "客家菜文化推广大使"],
        bio: "深耕餐饮行业三十余年，专注客家菜技艺传承、菜品创新与餐饮产品战略。曾任世纪金源酒店集团中餐出品总监 15 年，统筹 20 家五星级酒店的开业筹备、出品品质与厨政团队建设。",
        highlights: ["世界中餐业联合会国际中餐青年名厨专业委员会副主席", "传承与推广客家盐焗鸡技艺", "赴近 30 个国家和地区开展中餐文化交流与厨艺展演", "菜单定位与定价、菜品研发、配方卡与烹饪流程标准化", "厨房动线、食材成本、损耗与食品安全改善"] },
      { group: "专家团", name: "余向东", latin: "YU XIANGDONG", photo: "people/yuxiangdong.png",
        seat: { title: "餐饮后厨设计专家", field: "后厨动线 · 设备展陈" },
        roles: ["餐饮后厨设计专家", "厨政与设备展陈设计"],
        bio: "从事后厨效率管理与设备展陈设计近 30 年。从厨房实际作业出发，梳理备餐、烹制、出品与传菜动线，结合菜品结构、人员配置与设备性能规划后厨布局，让品牌展示和出餐效率相互配合。",
        highlights: ["近 30 年厨政管理、后厨效率与设备展陈设计", "服务落地游园京梦、一坐一忘、半山腰儿、悦融、琥珀京鲁菜、苏小牛等品牌", "新店筹备、厨房改造与设备展示项目的需求梳理与实施", "设备选型与展示逻辑结合餐饮空间体验"] }
    ];

    // ── page numbers follow the running order
    let n = 0; const next = () => ++n; const pg = {};
    ["cover", "promise", "s1", "sec1", "modules", "matrix"].forEach((k) => pg[k] = next());
    const modules = MODULES.map((m, i) => {
      const cn = ["一", "二", "三", "四", "五", "六"][i] || String(i + 1);
      const dp = next(); const tp = showTimelines ? next() : null;
      return { label: "模块" + cn + " · " + m.key, timelineLabel: "推进节点 · " + m.key,
        detail: Object.assign({ eyebrow: "服务模块" + cn + " · " + m.key, title: m.title, image: m.image, page: dp }, m.detail),
        timeline: Object.assign({ eyebrow: "推进节点 · 模块" + cn + " " + m.key, tag: m.title, page: tp }, m.timeline) };
    });
    ["rhythm", "options", "s2", "sec2", "ladder", "scrReport", "scrProduct", "scrPrice", "scrTrade", "chartA", "chartB", "value", "s3", "caseIndex"].forEach((k) => pg[k] = next());
    const cases = CASES.map((c, i) => ({ label: "案例 " + String(i + 1).padStart(2, "0") + " · " + c.name, props: Object.assign({}, c, { index: i + 1, total: CASES.length, page: next() }) }));
    ["partners", "sec3", "roster"].forEach((k) => pg[k] = next());
    const people = PEOPLE.map((x) => ({ label: x.group + " · " + x.name, props: { eyebrow: "团队 · " + x.group, name: x.name, latin: x.latin, photo: x.photo, roles: x.roles, bio: x.bio, highlights: x.highlights, page: next() } }));
    ["statsA", "statsB", "s4", "contact"].forEach((k) => pg[k] = next());

    const brands = new Set(CASES.map((c) => c.name));
    return {
      pg, modules, cases, people, showTimelines, highlightModule,
      promise: { eyebrow: "侍天 TIANSIGHT", title: "菜单，是餐厅每天都在做的经营决策。", body: "卖什么、怎么定价、如何组合，决定顾客怎么点，也决定采购、后厨和利润。侍天从菜单入手，帮餐厅把这些决定做对。",
        points: [{ label: "让顾客愿意点", note: "餐厅概念、招牌产品、菜单结构与价格。" }, { label: "让团队做得稳", note: "产品标准、岗位分工、培训与例会。" }, { label: "让经营留下收益", note: "每项调整有依据，结果逐项核对。" }] },
      moduleSteps: MODULES.map((m) => ({ label: m.key, q: m.title, aim: m.aim })),
      rhythm: { eyebrow: "服务内容 · 交付节奏", title: "交付节奏", tag: "周报 · 月度复盘 · 季度复盘 · 阶段成果",
        note: "口径：按各模块标准周期绘制，新店开业以签约后第 60 日开业为参考；实际节点随项目进度调整。",
        axis: { min: 0, max: 12, ticks: [{ at: 0, label: "签约" }, { at: 3, label: "3 月" }, { at: 6, label: "6 月" }, { at: 9, label: "9 月" }, { at: 12, label: "12 月" }] },
        labelWidth: 280, markers: [],
        rows: [{ label: "新店开业", sub: "签约 → 开业后 90 天", from: 0, to: 5, out: "13 周报 · 3 月复盘" }, { label: "概念开创", sub: "首轮 12 周", from: 0, to: 2.8, out: "12 周进展 · 3 期成果" }, { label: "经营复盘", sub: "标准首期 90 天", from: 0, to: 3, out: "周快报 · 3 月复盘" }, { label: "连锁督导", sub: "标准首年 12 个月", from: 0, to: 12, out: "52 周报 · 12 月报 · 4 季复盘", accent: true }] },
      brainParts: [{ tier: "MENU SIMULATION", name: "菜单推演", got: "用真实点单数据，推演不同菜单方案的变化。" }, { tier: "OPERATING DASHBOARD", name: "经营看板", got: "看清哪里变了、影响多大、先处理什么。" }, { tier: "COACHING", name: "教练式督导", got: "每条建议落实到负责人和完成时间。" }, { tier: "CONTINUOUS REVIEW", name: "持续复盘", got: "预期与实际对照，为下一次决策提供依据。" }],
      screens: {
        report: { eyebrow: "方法论 · 报告样张", title: "诊断报告，\n逐页给出依据", body: "方法论地图、决策维度与分析维度，每一页先写结论，再给依据。", note: "报告样张为演示版本 · 模拟数据，非客户数据",
          shots: [{ src: "deck/report-page-1.jpg", caption: "方法论地图" }, { src: "deck/report-page-2.jpg", caption: "决策维度" }, { src: "deck/report-page-3.jpg", caption: "分析维度" }] },
        product: { eyebrow: "方法论 · 产品界面", title: "经营看板，\n持续跟踪同一组数据", body: "诊断之后，看板按周月跟踪同一组指标，从矩阵到单品，再到手机上的复盘。", note: "产品界面为演示界面 · 模拟数据，非客户数据", layout: "grid",
          shots: [{ src: "deck/dashboard-1.jpg", caption: "经营看板" }, { src: "deck/dashboard-2.jpg", caption: "矩阵四象限" }, { src: "deck/dashboard-3.jpg", caption: "SKU 画像" }, { src: "deck/dashboard-4.jpg", caption: "来源审计" }, { src: "deck/mobile-review.jpg", caption: "移动端复盘" }] },
        price: { eyebrow: "方法论 · 价格带与菜品矩阵", title: "价格带与菜品矩阵", body: "按价格带对比新店与老店的销售份额，每个判断落到具体菜品。", note: "报告页 4.4.3 · 价格带断层诊断 · 模拟数据", layout: "feature",
          shots: [{ src: "deck/price-band-gap.jpg", caption: "180–250 元价格带 · 新店额占比 4.4%，形成断层" }, { src: "deck/penetration-matrix.jpg", caption: "渗透率矩阵 · 哪些菜点的人多、贡献高" }, { src: "deck/profit-sensitivity.jpg", caption: "利润敏感性矩阵 · 调价与成本的影响" }] },
        trade: { eyebrow: "方法论 · 商圈与复购", title: "商圈供需\n与复购分层", body: "看清周边竞品与供需缺口，按复购表现给顾客分层。", note: "案例 · 潮发潮汕牛肉",
          shots: [{ src: "deck/trade-area-supply.jpg", caption: "商圈供需洞察 · 周边竞品与供需缺口" }, { src: "deck/repurchase-quadrant.jpg", caption: "复购分层四象限" }] }
      },
      caseIndex: CASES.map((c) => ({ tag: c.module, title: c.name, body: c.summary, logo: c.logo })),
      caseSummary: brands.size + " 个品牌 · " + CASES.length + " 个项目 · 覆盖四个服务模块",
      partnerLogos: [{ name: "苏帮袁", src: "logos/subangyuan.png" }, { name: "清水亭", src: "logos/qingshuiting.png" }, { name: "3699 河鲜小馆", src: "logos/3699.png" }, { name: "游园京梦", src: "logos/youyuanjingmeng.png" }, { name: "吴裕泰", src: "logos/wuyutai.png" }, { name: "韵 1980 新派淮扬菜", src: "logos/yun1980.png" }, { name: "潮发潮汕牛肉", src: "logos/chaofa.png" }, { name: "石头先生的汉堡", src: "logos/shitou.png" }, { name: "石头先生的烤炉", src: "logos/shitou.png" }, { name: "更多伙伴" }],
      roster: PEOPLE.map((x) => ({ name: x.name, title: x.seat.title, field: x.seat.field, photo: x.photo })),
      teamOrg: { title: "企业大学、出品与后厨", subtitle: "把方法沉淀进组织", source: null,
        columns: [
          { title: "餐饮企业大学", stats: [{ value: "20+", label: "定制化教练式培训", note: "跨国企业及国央企 CXO" }, { value: "10+", label: "高校师资教练课程" }, { value: "0 → 1", label: "EHL 在华业务落地", note: "延伸至欧洲、中东、非洲" }] },
          { title: "五星级酒店出品体系", stats: [{ value: "20 家", label: "五星级酒店", note: "开业筹备与出品统筹" }, { value: "15 年", label: "中餐出品总监", note: "世纪金源酒店集团" }, { value: "近 30", label: "国家和地区", note: "中餐文化交流与厨艺展演" }] },
          { title: "后厨设计落地", stats: [{ value: "近 30 年", label: "后厨效率管理与设备展陈设计" }, { value: "6+", label: "代表落地品牌", note: "游园京梦 · 一坐一忘 · 半山腰儿 · 悦融 · 琥珀京鲁菜 · 苏小牛" }] }
        ] }
    };
  }
}