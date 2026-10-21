// 幻灯片目录 · 唯一来源。每页一个永久 id（UUID），供官网、always-mcapp、API 与 MCP 引用。
// e(id, 页名 data-label, 分类, 版式, "标签 空格分隔", 发布, 用途, { evidence, note })
// · id 一经发布不再改动；页名改了只改 label。
// · 同一页出现在多份文稿（团队、联系）时共用一个 id。
// · 页名必须与演示文件 data-label 一致；未登记的页会在控制台提示。
(function () {
  const CATEGORIES = {
    brand:   { name: "品牌主张",       page: "/about" },
    service: { name: "服务内容",       page: "/services" },
    system:  { name: "餐饮第二大脑",   page: "/second-brain" },
    kitchen: { name: "厨政专项",       page: "/kitchen" },
    design:  { name: "展陈与厨房设计", page: "/design" },
    proof:   { name: "案例与实证",     page: "/cases" },
    team:    { name: "团队",           page: "/team" },
    engage:  { name: "合作与联系",     page: "/contact" },
    nav:     { name: "结构页",         page: null }
  };
  const TYPES = ["cover", "section", "statement", "promise", "steps", "tiers", "cards", "table", "timeline", "module", "gallery", "screens", "chart", "case", "logos", "stats", "roster", "profile", "contact"];
  const PUBLISH = { web: "可发布到官网", banner: "结构页，图片可作栏目横幅", hold: "待确认后发布（见 note）", internal: "仅用于演示，不上官网" };
  const EVIDENCE = { real: "实景照片", sample: "样张数据", external: "外部研究", partner: "合作方资料", illustration: "示意图" };

  const e = (id, label, cat, type, tags, publish, purpose, x) => Object.assign({ id, label, cat, type, tags: tags ? tags.split(" ") : [], publish, purpose }, x || {});

  const TEAM = {
    bianjiang:   e("ed451b90-dc1f-497d-82c3-d9cb095dd225", "联合创始人 · 边江", "team", "profile", "人物 联合创始人 菜单 定位", "web", "边江个人介绍：履历、服务品牌与代表成果。"),
    guofeng:     e("8101bf62-d9e5-42da-84f6-107f597c4620", "联合创始人 · 郭峰", "team", "profile", "人物 联合创始人 组织 服务体验", "web", "郭峰个人介绍：EHL 背景、组织与 AI 应用。"),
    liquanchao:  e("5419cbed-e0d1-46a9-bd7b-393c6b260205", "专家团 · 李权超", "team", "profile", "人物 专家 出品 厨政", "web", "李权超个人介绍：出品与厨政管理经历。"),
    yuxiangdong: e("c61ee06c-d855-4ca4-9808-9cd1aa7a9e90", "专家团 · 余向东", "team", "profile", "人物 专家 后厨设计 展陈", "web", "余向东个人介绍：后厨设计与展陈项目经历。")
  };
  const team = (order) => order.map((k) => TEAM[k]);
  const contact = e("60f54dbe-8e06-45c8-b877-b1574f1e6bee", "联系", "engage", "contact", "联系 二维码", "web", "收尾页：品牌口号、微信二维码与官网地址。");

  const intro = [
    e("b63a770d-49c7-40e5-8db3-02bc6ede0331", "封面", "nav", "cover", "企业介绍", "banner", "企业介绍封面：从一道菜，到一家家店的好生意。"),
    e("a34bdc46-9be1-45a0-9300-fd57ea216be3", "主张", "brand", "promise", "主张 菜单 定价 组合", "web", "说明菜单是每天的经营决策，以及侍天带来的三项价值。"),
    e("3531cea9-7492-4d22-9767-cc7977113b06", "问题", "brand", "statement", "痛点 经营决策", "web", "整页陈述：经营决定缺少依据。", { evidence: "illustration" }),
    e("7ad0a1ed-21fd-4632-874c-0c342bd6f6ab", "节首 · 一", "nav", "section", "从开店到连锁", "banner", "第一章节首：从开店到连锁。"),
    e("916c9d8c-56d4-45f0-9722-01ff073a4219", "四个阶段", "service", "steps", "四个阶段 开店之前 经营之中 每月复盘 复制扩张", "web", "四个阶段的服务主线（销售提案版）。", { note: "销售提案版" }),
    e("ceaf94a2-1d19-4029-8bf5-c2740e99f04a", "服务模式", "service", "tiers", "服务模式 经营诊断 落地辅导 第二大脑陪跑", "web", "三档服务模式，按餐饮类型与经营阶段选择（销售提案版）。", { note: "销售提案版" }),
    e("36b35d54-c26c-4985-8c82-d0f758848008", "四个服务模块", "service", "steps", "服务模块 新店 概念 复盘 连锁", "web", "四个服务模块总览，每个模块一句目标。"),
    e("55cf1cdc-2258-41d3-9e3a-a39c23790784", "经营层 × 模块", "service", "table", "服务模块 经营层", "web", "经营层与四个服务模块的对应矩阵。"),
    e("f97c967e-6f86-45fb-bb36-e22d1df0dfff", "模块一 · 新店开业", "service", "module", "新店 可研 开业督导 交付物", "web", "新店可研与开业督导：步骤、周期与交付物。"),
    e("fe3e5ea3-cd6d-4618-b48e-1c2d04a74222", "推进节点 · 新店开业", "service", "timeline", "新店 排期", "internal", "新店模块排期：签约至开业后 90 天。"),
    e("bfea5864-e5c2-43ef-8f35-ee8ef113e40f", "模块二 · 概念开创", "service", "module", "概念 定位 产品创新 交付物", "web", "定位概念开创与产品价值创新：步骤、周期与交付物。"),
    e("82689cc6-d75f-4e4b-b4ac-d567c8708feb", "推进节点 · 概念开创", "service", "timeline", "概念 排期", "internal", "概念模块排期：首轮 12 周三期成果。"),
    e("1bfcb28d-0489-4267-bc88-bb5afd9edd30", "模块三 · 经营复盘", "service", "module", "复盘 菜单优化 交付物", "web", "经营复盘与优化：步骤、周期与交付物。"),
    e("47a1e177-3245-4eaf-9bd2-c839ee78e217", "推进节点 · 经营复盘", "service", "timeline", "复盘 排期", "internal", "复盘模块排期：先诊断，再改菜单，按月复盘。"),
    e("9ca9a8f2-58ca-4b23-bf8a-f00ac306c17e", "模块四 · 连锁督导", "service", "module", "连锁 督导 标准化 交付物", "web", "连锁规模化运营督导：步骤、周期与交付物。"),
    e("45a17eba-ac0a-4d77-8fd6-c6a3660d2573", "推进节点 · 连锁督导", "service", "timeline", "连锁 排期", "internal", "连锁模块排期：标准首年 12 个月。"),
    e("77f65faf-72a4-41f9-9d44-5f93ef892f50", "交付节奏", "service", "timeline", "交付 周报 月度复盘", "web", "四个模块的交付周期与报告节奏对照。"),
    e("64fe666d-a6dd-4eb9-84ca-12b1087950dd", "可选专项", "service", "cards", "专项", "web", "可在模块之外叠加的专项服务。"),
    e("a3899939-9c43-4f5b-b6ee-e12b7615f862", "数据", "system", "statement", "数据 订单", "web", "整页陈述：每一张订单都是顾客投下的一票。", { evidence: "illustration" }),
    e("82e572f3-d3bc-49d8-8b65-39d2d79c0782", "节首 · 餐饮第二大脑", "nav", "section", "第二大脑", "banner", "第二章节首：餐饮第二大脑。"),
    e("7bdbce6f-a0e8-49ab-bd3d-64c2dfc8565c", "第二大脑 · 四个部分", "system", "tiers", "第二大脑 菜单推演 经营看板 教练式督导 持续复盘", "web", "第二大脑的四个部分及各自作用。"),
    e("d7f7675c-d971-476e-a6b4-1199320ef1ab", "样张为证", "system", "chart", "报告 样张 价格带", "web", "报告样张与午市价格带分布图（销售提案版）。", { evidence: "sample", note: "销售提案版" }),
    e("fe45c1ed-a833-4b4a-9243-ba217666b1cc", "图谱", "system", "chart", "图表 渗透率 利润归因 菜单推演", "web", "可切换的分析图：渗透率矩阵 / 利润归因 / 菜单推演（销售提案版）。", { evidence: "sample", note: "销售提案版" }),
    e("1e564f65-294a-4ca3-80cf-c1769347aa3d", "报告样张", "system", "screens", "报告 样张", "web", "经营报告样张页面截图。", { evidence: "sample" }),
    e("99963461-1bc0-4f5d-98dc-9f08ca6fe1a0", "产品界面", "system", "screens", "产品 经营看板 截图", "web", "第二大脑平台界面截图：看板与移动端复盘。", { evidence: "sample" }),
    e("d300e5eb-7629-435b-abbc-22f91e013c28", "价格带与菜品矩阵", "system", "screens", "价格带 渗透率 菜品矩阵", "web", "价格带断层与菜品渗透率矩阵截图。", { evidence: "sample" }),
    e("48d9c918-a62e-430f-952b-bc8007f333c6", "商圈供需与复购分层", "system", "screens", "商圈 复购", "web", "商圈供需洞察与复购分层四象限截图。", { evidence: "sample" }),
    e("7dd147e8-c3c8-412a-a6db-001140f41a34", "利润归因", "system", "chart", "利润 归因 瀑布图", "web", "利润归因瀑布图：去年同期到当期按驱动因素拆分。", { evidence: "sample" }),
    e("27ee71ef-7f9f-46f5-b9d3-5cd83dd7eed8", "菜单推演", "system", "chart", "菜单推演 预测区间", "web", "菜单推演预测区间图（P10–P90），标明为推断。", { evidence: "sample" }),
    e("b8fbe927-ea40-4906-8c98-9b2928eb53d5", "老板看到的价值", "brand", "promise", "价值 三不 验收", "web", "老板看得到的经营变化与三不原则。"),
    e("58a82f6d-8e63-4ac1-8416-ba0ec1ca872c", "伙伴案例", "proof", "case", "案例", "internal", "销售提案版的单页案例；官网改用案例 01–08。", { note: "销售提案版" }),
    e("812447ee-f013-4213-a98a-89e9c7d4f127", "实证", "proof", "statement", "实证", "web", "整页陈述：从一家店，到近百家店。", { evidence: "illustration" }),
    e("06c5c56b-0e55-4ccb-bbcf-6023afdbebed", "伙伴案例 · 索引", "proof", "table", "案例 索引", "web", "八个伙伴案例的索引卡片。"),
    e("f944281f-0a18-41c8-85f8-195236bf3325", "案例 01 · 石头先生", "proof", "case", "案例 汉堡", "web", "伙伴案例：石头先生的汉堡。"),
    e("11f58198-e3a9-4f0c-ac0c-a3d55763eb3c", "案例 02 · 清水亭", "proof", "case", "案例", "web", "伙伴案例：清水亭。"),
    e("909bcf6d-4727-457e-bded-15bf27df98e2", "案例 03 · 石头先生", "proof", "case", "案例 烤炉", "web", "伙伴案例：石头先生的烤炉。"),
    e("fa570563-6805-4835-bf60-5c5d15441864", "案例 04 · 苏帮袁", "proof", "case", "案例 苏帮菜", "web", "伙伴案例：苏帮袁。"),
    e("923f6876-5004-4249-bc57-bcc55989ce5c", "案例 05 · 潮发", "proof", "case", "案例 潮汕牛肉", "web", "伙伴案例：潮发潮汕牛肉。"),
    e("6668bdcd-fc78-4a34-8d9b-5f735207fa8e", "案例 06 · 游园京梦", "proof", "case", "案例", "web", "伙伴案例：游园京梦。"),
    e("e9ee5393-4d7d-4a62-aacb-4ea80285d9de", "案例 07 · 韵1980淮扬菜", "proof", "case", "案例 淮扬菜", "web", "伙伴案例：韵 1980 新派淮扬菜。"),
    e("4289c668-7be0-4db0-90cf-6ae8ce371c12", "案例 08 · 吴裕泰", "proof", "case", "案例 茶饮", "web", "伙伴案例：吴裕泰。"),
    e("2d940251-bde3-40c7-904e-2b0c47042f05", "伙伴背书", "proof", "logos", "伙伴 logo", "web", "伙伴品牌 logo 墙。"),
    e("ceb4f385-17f4-46cf-aaaf-3fe469db76e2", "节首 · 团队", "nav", "section", "团队", "banner", "第三章节首：团队（企业介绍）。"),
    e("ba744346-0af7-452a-a815-974d6b106700", "团队", "team", "roster", "团队 联合创始人 专家团", "web", "团队总览：两位联合创始人与两位专家。"),
    ...team(["bianjiang", "guofeng", "liquanchao", "yuxiangdong"]),
    e("c5b7abdd-d3a2-44b0-a155-93ff56c79ee9", "团队案例 · 品牌增长", "team", "stats", "团队 品牌增长 履历", "web", "团队过往服务中的品牌增长数据。"),
    e("03051a0b-475c-4847-a438-ab022540c12f", "团队案例 · 组织与后厨", "team", "stats", "团队 组织 后厨 履历", "web", "团队过往服务中的组织与后厨成果。"),
    e("cdbe10c1-a934-4565-b22c-32620690305a", "决策", "brand", "statement", "拍板之前问侍天", "web", "整页陈述：拍板之前，问侍天。", { evidence: "illustration" }),
    contact
  ];

  const R = { evidence: "real" }, P = { evidence: "partner" };
  const kitchen = [
    e("75b5d850-ef53-427e-810d-b5f8519c5c47", "封面", "nav", "cover", "厨政专项", "banner", "厨政专项封面：把标准留在现场，把能力留给团队。"),
    e("24dd2b24-1129-494e-99fb-2fe612c62f19", "服务理念", "kitchen", "promise", "厨管合一 执行 管理 创新", "web", "厨政服务理念：强执行、懂管理、善创新。"),
    e("4fef1e6b-f64c-42a4-8d73-76e78d029569", "厨务痛点", "kitchen", "table", "痛点 标准 效率 出品 损耗 食安", "web", "五个厨务痛点、对经营的影响与服务回应；提案改善目标的来源。"),
    e("b23b1430-3927-45ca-9950-82cc2d516f25", "节首 · 管理体系", "nav", "section", "管理体系", "banner", "第一章节首：管理体系。"),
    e("1bef457e-aada-4eb7-9e63-52697e2698c7", "从经验到体系", "kitchen", "steps", "管理体系 精细化 数据化 标准化 系统化", "web", "从经验管理到体系运行的四步。"),
    e("33278844-0b8c-43b8-ae00-efc880a1b592", "6T 管理", "kitchen", "cards", "管理体系 6T", "web", "6T 管理的六个日常动作。"),
    e("767d87a9-26b1-404b-947e-ef46a19fb49b", "可视化管理", "kitchen", "tiers", "管理体系 可视化", "web", "可视化管理的层级与做法。"),
    e("e3b2a7ad-bd57-45cb-93f6-863550916c28", "风险识别", "kitchen", "cards", "管理体系 食安 风险", "web", "后厨风险识别清单。"),
    e("07d7592f-5464-42ed-9919-9b483d6f3de4", "应急预案", "kitchen", "gallery", "管理体系 应急", "web", "应急预案现场张贴实景。", R),
    e("cef41141-7bf7-423e-b543-fefd986159c6", "节首 · 现场标准", "nav", "section", "现场标准", "banner", "第二章节首：现场标准。"),
    e("eafab63e-953c-409c-87bf-4afeb6f6bfd7", "储存管理", "kitchen", "steps", "现场标准 储存", "web", "储存管理的步骤与要求。"),
    e("cfcfcd48-d6db-4466-96dd-ae499aa122e5", "冷藏分类", "kitchen", "gallery", "现场标准 储存 冷藏", "web", "冷藏分区分类实景。", R),
    e("5d4889fa-fd9a-46cf-b96b-c997dc83a1a9", "冷藏标签", "kitchen", "gallery", "现场标准 储存 冷藏 标识", "web", "冷藏标签实景。", R),
    e("8183d369-af25-4844-8f0d-7150333d869d", "分装标识", "kitchen", "gallery", "现场标准 储存 标识", "web", "分装与标识实景。", R),
    e("656fb38b-d8f9-4aec-b28e-49e2e81910bf", "调料存放", "kitchen", "gallery", "现场标准 储存 调料", "web", "调料存放实景。", R),
    e("7d9d06c0-d6a9-48b2-a827-d7c7f66ed6f4", "调料二次生命期", "kitchen", "table", "现场标准 调料 保质期", "web", "调料开封后二次生命期对照表。"),
    e("e361daa8-83a8-4cdd-890c-bdf416b809c8", "工具定置", "kitchen", "gallery", "现场标准 工具定置", "web", "工具定置实景。", R),
    e("439085ee-6168-436f-96e8-b1c128d2bc9a", "清洗工具", "kitchen", "gallery", "现场标准 清洁 工具定置", "web", "清洗工具定置实景。", R),
    e("5ee6b1fc-5513-4740-b800-9d9bd34467d6", "工作台", "kitchen", "gallery", "现场标准 台面", "web", "工作台面标准实景。", R),
    e("240279bf-2bad-4484-970c-c8e939b1fd5f", "设备与备料", "kitchen", "gallery", "现场标准 设备 备料", "web", "设备与备料区实景。", R),
    e("60f68492-0a44-49ed-82b1-013be536290b", "现场定置", "kitchen", "gallery", "现场标准 工具定置", "web", "现场定置与档案实景。", R),
    e("3fd8612f-e855-44fa-805a-e945aaa4f040", "清洁工具定置", "kitchen", "gallery", "现场标准 清洁 工具定置", "web", "清洁工具定置实景。", R),
    e("9344f14f-d46b-475f-b2c8-a9ac2e5a8374", "洗手设施", "kitchen", "gallery", "现场标准 食安 洗手", "web", "洗手设施实景。", R),
    e("8dfe15df-c1c8-4ea5-92db-6e17b0c2b261", "收餐处理", "kitchen", "gallery", "现场标准 收餐 洁污分流", "web", "收餐处理与洁污分流实景。", R),
    e("753ea379-36ea-4a59-8f63-55390d5326a3", "洗菜作业", "kitchen", "gallery", "现场标准 洗涤", "web", "洗菜作业实景。", R),
    e("34e22dea-78aa-4eac-ab8d-671849b4e81d", "明档陈列", "kitchen", "gallery", "现场标准 明档 陈列", "web", "明档陈列实景。", R),
    e("cde83ba4-524d-478b-a060-e1976feada9e", "设备责任卡", "kitchen", "gallery", "现场标准 设备 责任", "web", "设备责任卡实景。", R),
    e("ce53ab36-97d6-4455-9da8-c8b111e77484", "巡检机制", "kitchen", "gallery", "现场标准 巡检", "web", "巡检机制实景。", R),
    e("7ebb7b83-c789-4f81-a217-1546e1310793", "节首 · 量化与品控", "nav", "section", "量化与品控", "banner", "第三章节首：量化与品控。"),
    e("fd830be9-0765-4f74-bb5a-6bd34ade0c6d", "量化制作", "kitchen", "steps", "量化 品控", "web", "量化制作的步骤。"),
    e("33adbeba-ed42-4be9-891b-bba7cf9ff6a0", "量化与分色", "kitchen", "gallery", "量化 分色", "web", "量化工具与分色实景。", R),
    e("46c1c655-80fc-4a90-bca0-0a6d7475c671", "分色管理", "kitchen", "gallery", "分色 食安", "web", "分色管理实景。", R),
    e("c5a3333b-2be9-4e95-8c44-4cc1cd4ead49", "色标对照", "kitchen", "table", "分色 5S 色标", "web", "5S 色标按用途分组的对照表。"),
    e("33893f5d-97d4-4059-9385-b23b7f02b465", "品控工具", "kitchen", "cards", "品控 工具", "web", "品控工具清单。"),
    e("69186ea2-161b-485f-8545-8c505447e863", "产品 SOP", "kitchen", "cards", "品控 SOP", "web", "产品 SOP 的组成。"),
    e("7c8dc302-9791-41a3-9ec1-83b09ede0b6a", "节首 · 落地机制", "nav", "section", "落地机制", "banner", "第四章节首：落地机制。"),
    e("5bd3b505-b440-4373-9f27-8243b321fd4b", "纠偏闭环", "kitchen", "steps", "落地 纠偏", "web", "发现、纠偏、复查的闭环步骤。"),
    e("a2233e73-f720-4175-94f7-a88259d0f014", "三个机制", "kitchen", "promise", "落地 机制", "web", "保证标准落地的三个机制。"),
    e("10a2cbd4-90b1-453e-9ba9-7627f1e03342", "运行节奏", "kitchen", "table", "落地 例会 节奏", "web", "日、周、月的运行节奏表。"),
    e("6d7cda56-3007-4a10-8a76-5e5b77e66793", "服务交付物", "kitchen", "table", "落地 交付物", "web", "厨政服务交付物清单。"),
    e("ad2040c0-b786-4ab6-8610-43c96ab0826f", "计量与验收", "kitchen", "table", "落地 验收 指标", "web", "计量口径与验收指标。"),
    e("3ede721f-fe1a-44a6-b880-569b6214e6e6", "总结", "kitchen", "promise", "总结", "web", "厨政专项总结。"),
    e("b01c2f1b-b527-462c-b5ae-30c135a41296", "鲜与稳", "kitchen", "statement", "总结 出品", "web", "整页陈述：鲜与稳。"),
    e("a50c735a-9455-4409-8441-5b90c244073b", "节首 · 团队", "nav", "section", "团队", "banner", "第五章节首：团队（厨政专项）。"),
    ...team(["bianjiang", "guofeng", "liquanchao", "yuxiangdong"]),
    e("88ef1824-0213-45c2-9439-fc4b7b829e76", "专家 · 研发与管理", "team", "gallery", "李权超 研发 酒店", "web", "李权超研发与管理经历，配酒店厨政团队合影。", R),
    e("262cf8b7-e0dc-4c1e-9ec7-6ee914085562", "产品研发", "team", "gallery", "李权超 研发 菜品", "web", "李权超产品研发菜品图集。", R),
    e("a03d3e56-2874-404a-a734-8b88df47986c", "服务方式", "engage", "steps", "合作方式 厨政", "web", "厨政合作方式：看现场、定重点、定范围、再实施。"),
    contact
  ];

  const exhibit = [
    e("5e6b6f17-2773-4b81-95c4-8e27de028529", "封面", "nav", "cover", "餐饮展陈与厨房设计", "banner", "餐饮展陈与厨房设计封面。"),
    e("08d447c4-1e58-45c1-83b2-9f28976cdd7f", "主张", "design", "promise", "主张 明档 出品 效率", "web", "主张：出品可见、品质稳定、高峰高效。"),
    e("bba93bc0-e4f8-4068-8984-2935d93d8cfb", "问题", "design", "table", "痛点 上菜 出品 照明 卫生", "web", "由顾客感知深挖原因，对应设计对策。"),
    e("3f41859f-1d87-4ded-a0a5-95177bd788ed", "菜单驱动", "design", "steps", "方法 菜单驱动", "web", "从菜单工艺推导后厨设计的步骤。"),
    e("cf2c6541-8f7f-4f78-a90b-816e61be6e7d", "节首 · 用餐体验", "nav", "section", "用餐体验 让顾客愿意点", "banner", "第一章节首：让顾客愿意点（用餐体验）。"),
    e("eb32d32e-c909-42cb-87c9-0b907b3ea1ed", "体验动线", "design", "steps", "用餐体验 体验动线", "web", "沿顾客一餐的五个停留点安排厨房可见部分。"),
    e("d08c13a5-d95f-4d16-a212-7cf71ba95537", "明档尺度", "design", "tiers", "用餐体验 明档", "web", "四种明档尺度及适合的品类。"),
    e("e5b3a0d8-2f6c-4b91-8e47-91c2d6a5f0b3", "光与视觉", "design", "table", "用餐体验 照明 摆盘 点单 客单 研究", "hold", "侍天在光线、摆盘、氛围上的四项做法与待验证目标。", { evidence: "external", note: "保留方法页；结果表述为待验证目标，不承诺门店收益。" }),
    e("1f8c6e27-b4d3-4a59-9c02-7e5a3d81b6c4", "光与视觉 · 成效", "design", "stats", "用餐体验 光线 摆盘 明档 研究 成效", "hold", "光线、摆盘与双向可见的外部研究及实验情境。", { evidence: "external", note: "已按原始论文修订；支持数字附实验情境，未核实数字改定性。详见 docs/content-provenance.md。" }),
    e("6b98ca6f-126a-4a4e-85f3-fa44feb38344", "明档实景", "design", "gallery", "用餐体验 明档", "web", "明档出品线项目实景拼板。", P),
    e("cecda97f-9fb6-40fa-b437-22da4bcb1395", "展示岛台", "design", "gallery", "用餐体验 岛台", "web", "展示岛台项目实景拼板。", P),
    e("97aca518-0224-4cfd-823c-13e258967232", "节首 · 出品展陈", "nav", "section", "出品展陈 让招牌菜卖上价", "banner", "第二章节首：让招牌菜卖上价（出品展陈）。"),
    e("9b1b891a-3fea-46e6-9eab-cf05efd17716", "展陈六要素", "design", "cards", "出品展陈", "web", "出品展陈的六个要素。"),
    e("1ebbbf22-f947-4331-9d56-e06f526c54db", "出品台", "design", "gallery", "出品展陈 出品台", "web", "出品台项目实景拼板。", P),
    e("69a70c07-74f7-4269-bd23-b491dd6c7b68", "明档细节", "design", "gallery", "出品展陈 明档", "web", "明档细节项目实景拼板。", P),
    e("2c61e7ef-c71a-4ccb-8308-e7407dda3cf8", "出品动线", "design", "steps", "出品展陈 动线", "web", "从出餐口到餐桌的出品动线。"),
    e("bf00938c-e2a7-47a2-a11f-e609597ad24c", "节首 · 后厨设计", "nav", "section", "后厨设计 让高峰出得快", "banner", "第三章节首：让高峰出得快（后厨设计）。"),
    e("76300fea-d62c-4907-8081-e9379fc4ef8d", "功能分区", "design", "chart", "后厨设计 分区", "web", "后厨六大功能区与食物、餐具流向图。"),
    e("76d3d22d-c460-4b4c-ab4e-dd673ba5aae8", "动线原则", "design", "table", "后厨设计 动线 洁污分流", "web", "后厨动线原则对照表。"),
    e("f61420aa-efab-46d0-926e-0b53a9fe7f77", "后厨实景 · 一", "design", "gallery", "后厨设计", "web", "后厨项目实景拼板（一）。", P),
    e("54df294e-e1a0-43b2-8094-1f6a303c0788", "后厨实景 · 二", "design", "gallery", "后厨设计", "web", "后厨项目实景拼板（二）。", P),
    e("d2c0bdd1-2cdf-4c7a-90fe-14e39a5e2db1", "节首 · 设备与交付", "nav", "section", "设备与交付 让方案落得了地", "banner", "第四章节首：让方案落得了地（设备与交付）。"),
    e("cbce9078-e6b6-4c22-ae8c-becc6b98c001", "设备选型", "design", "table", "设备 选型", "web", "设备选型的五个标准。"),
    e("d9a3002f-14cf-4f76-b061-81f6f58d9fc9", "供应体系", "design", "stats", "设备 供应链", "web", "设备合作方的生产、仓储与安装能力。", P),
    e("b28ad6d5-1a75-4740-b42b-106d85f1384e", "全线配套", "design", "logos", "设备 供应品牌", "hold", "厨房到客房的全线配套品类与供应品牌。", { evidence: "partner", note: "品牌 logo 待换高清并确认使用许可" }),
    e("f745a121-4a40-4240-aec6-b95fc669ed1a", "服务经历", "proof", "logos", "酒店 国际酒店集团", "hold", "合作方服务过的国际酒店集团。", { evidence: "partner", note: "任务所有者已批准纳入本次设计系统发行；官网同步不在本任务范围。" }),
    e("5b1a9bb8-0955-4cf6-831a-0fc3ab3f6158", "服务品牌", "proof", "logos", "品牌墙 餐饮品牌", "hold", "余向东服务过的餐饮品牌墙。", { evidence: "partner", note: "品牌名称待余向东核对" }),
    e("7a2d9c41-5e3b-4f86-a1c7-0b9e4d62f318", "项目案例 · 游园京梦 · 一", "proof", "gallery", "项目案例 游园京梦 北京SKP 明档 园林", "hold", "游园京梦北京 SKP：园林步道与玻璃明档实景。", { evidence: "real", note: "任务所有者已批准保留实景照片；官网同步不在本任务范围。" }),
    e("c84f1b26-9d07-4e5a-b3f2-6a1e8c57d094", "项目案例 · 游园京梦 · 二", "proof", "gallery", "项目案例 游园京梦 北京SKP 食材陈列 明档", "hold", "游园京梦北京 SKP：食材陈列明档与后厨纵深实景。", { evidence: "real", note: "任务所有者已批准保留实景照片；官网同步不在本任务范围。" }),
    e("ae882cb3-0355-4165-a9c2-092412fcd9f4", "节首 · 落地方式", "nav", "section", "落地方式 让改善看得见", "banner", "第五章节首：让改善看得见（落地方式）。"),
    e("d923b05d-df80-4feb-ab3e-fbce2b6512b9", "新店与改造", "design", "table", "落地 新店 改造", "web", "新店与改造项目的不同做法。"),
    e("4ccad737-2ed1-464d-921f-e9e6bbdd6937", "服务流程", "engage", "steps", "落地 流程 合作方式", "web", "展陈与厨房设计的五步服务流程：需求、方案、深化、采购安装、陪跑。"),
    e("adefb319-95e5-49d1-895b-19e4e4578013", "交付物", "design", "table", "落地 交付物", "web", "设计服务交付物清单：需求、方案、深化、采购安装、陪跑。"),
    e("806e82b8-b93c-432d-a124-3fbd65816617", "验收指标", "design", "table", "落地 验收 指标", "web", "设计落地的验收指标。"),
    e("08a3dfe9-79cd-4f7b-93df-a63f51bc5ff5", "节首 · 团队", "nav", "section", "团队", "banner", "第六章节首：团队（展陈）。"),
    ...team(["yuxiangdong", "liquanchao", "bianjiang", "guofeng"]),
    e("9b4e2c7a-6d15-4f38-a0e9-3c7f5b18d2e6", "展陈诊断", "engage", "module", "合作入口 展陈诊断 现场勘察 点单", "hold", "合作入口：展陈诊断的四步与交付。", { note: "三类交付保留，数量按每次合作约定" }),
    contact
  ];

  const DECKS = {
    intro:   { file: "TiansightDeck.dc.html",         title: "企业介绍",           slides: intro },
    kitchen: { file: "TiansightDeck-Kitchen.dc.html", title: "侍天厨政专项介绍",   slides: kitchen },
    exhibit: { file: "TiansightDeck-Exhibit.dc.html", title: "餐饮展陈与厨房设计", slides: exhibit }
  };

  // 去重后的全部页，每页带出现位置 decks: [{ deck, page }]
  function all() {
    const byId = {}, out = [];
    for (const deck in DECKS) DECKS[deck].slides.forEach((s, i) => {
      if (!byId[s.id]) { byId[s.id] = Object.assign({}, s, { decks: [] }); out.push(byId[s.id]); }
      byId[s.id].decks.push({ deck, page: i + 1 });
    });
    return out;
  }
  const get = (id) => all().find((s) => s.id === id) || null;

  const warned = {};
  function stamp(deck) {
    const d = DECKS[deck]; if (!d) return;
    const map = {}; d.slides.forEach((s) => { map[s.label] = s; });
    document.querySelectorAll("section[data-label]").forEach((el) => {
      const label = el.getAttribute("data-label"), s = map[label];
      if (!s) { const k = deck + "|" + label; if (!warned[k] && label) { warned[k] = 1; console.warn("[slide-catalog] 未登记：" + k); } return; }
      const a = { "data-slide-id": s.id, "data-deck": deck, "data-category": s.cat, "data-type": s.type, "data-tags": s.tags.join(" "), "data-publish": s.publish, "data-evidence": s.evidence || "" };
      for (const n in a) if (el.getAttribute(n) !== a[n]) el.setAttribute(n, a[n]);
    });
  }
  function watch(deck) {
    let t; const run = () => { clearTimeout(t); t = setTimeout(() => stamp(deck), 120); };
    const mo = new MutationObserver(run); mo.observe(document.body, { childList: true, subtree: true });
    run(); return () => { mo.disconnect(); clearTimeout(t); };
  }

  window.TIANSIGHT_SLIDE_CATALOG = { version: "2026-10-20", CATEGORIES, TYPES, PUBLISH, EVIDENCE, DECKS, TEAM, all, get, stamp, watch };
})();
