const buttons = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll(".tab-panel")];
const tabTargets = [...document.querySelectorAll("[data-tab-target]")];
const contactOpen = document.querySelector("[data-contact-open]");
const contactOverlay = document.querySelector("[data-contact-overlay]");
const copyButtons = [...document.querySelectorAll("[data-copy-value]")];
const questButtons = [...document.querySelectorAll("[data-quest-open]")];
const externalLinkButtons = [...document.querySelectorAll("[data-external-url]")];
const questOverlay = document.querySelector("[data-quest-overlay]");
const questTitle = document.querySelector("[data-quest-title]");
const questBody = document.querySelector("[data-quest-body]");
const foodPlaceInput = document.querySelector("[data-food-place]");
const foodPlaceSuggestions = document.querySelector("[data-place-suggestions]");
const foodLocateButton = document.querySelector("[data-food-locate]");
const foodResolveButton = document.querySelector("[data-food-resolve]");
const foodCategoryGroup = document.querySelector("[data-food-category]");
const foodDistanceGroup = document.querySelector("[data-food-distance]");
const foodSearchButton = document.querySelector("[data-food-search]");
const foodRandomButton = document.querySelector("[data-food-random]");
const foodRandomAgainButton = document.querySelector("[data-food-random-again]");
const foodResults = document.querySelector("[data-food-results]");
const foodCount = document.querySelector("[data-food-count]");
const foodOverlay = document.querySelector("[data-food-overlay]");
const foodPicked = document.querySelector("[data-food-picked]");
const foodFloat = document.querySelector("[data-food-float]");
const foodFloatingRandomButton = document.querySelector("[data-food-floating-random]");
const foodBackTopButton = document.querySelector("[data-food-back-top]");
const sheetDistricts = document.querySelector("[data-sheet-districts]");
const sheetResults = document.querySelector("[data-sheet-results]");
const sheetCount = document.querySelector("[data-sheet-count]");
const sheetRandomButton = document.querySelector("[data-sheet-random]");
const sheetRandomAgainButton = document.querySelector("[data-sheet-random-again]");
const sheetOverlay = document.querySelector("[data-sheet-overlay]");
const sheetPicked = document.querySelector("[data-sheet-picked]");
const modalCloseButtons = [...document.querySelectorAll("[data-overlay-close]")];

const copyLabel = "\u590d\u5236";
const copiedLabel = "\u5df2\u590d\u5236";
const failedLabel = "\u5931\u8d25";
const maxFoodResults = 50;
const maxFoodCandidates = 500;
const maxFoodPagesPerKeyword = 3;
const maxFoodKeywordBatchSize = 3;
const foodSeenStorageKey = "xujiajie-food-seen-counts-v1";
const sheetSeenStorageKey = "xujiajie-sheet-food-seen-v1";
const maxSeenHistoryItems = 1800;
const maxPlaceSuggestions = 7;
const amapConfig = {
  key: "5fef069c3b4e5fc3cfb5a0a641c1ea30",
  securityJsCode: "2ea560f754583f60e6eac1f291ad2899",
};
const foodState = {
  category: "all",
  distance: "nearby",
  merchants: [],
  candidateCount: 0,
  resolvedCenter: null,
  resolvedInputValue: "",
  shouldKeepResolveButton: false,
  userLocation: null,
  placeSuggestions: [],
  placeSuggestionTimer: null,
  lastSearchKey: "",
};
const sheetFoodState = {
  district: "全部",
};
const shenzhenFoodDataUrl = "./assets/shenzhen-food-data.json";

async function loadSheetFoodData() {
  if (!sheetResults) return;

  try {
    const response = await fetch(`${shenzhenFoodDataUrl}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`data request failed: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data.food)) {
      sheetFoodData = data.food;
    }
    if (Array.isArray(data.avoid)) {
      sheetAvoidData = data.avoid;
    }
  } catch (error) {
    console.warn("Use embedded Shenzhen food data because live JSON failed.", error);
  }

  renderSheetDistricts();
  renderSheetFoodLibrary();
}

let sheetFoodData = [
    {
        "district":  "宝安",
        "name":  "手摇糯米糍",
        "address":  "流塘市场附近",
        "dishes":  "待补充",
        "average":  "5",
        "rating":  "100",
        "note":  "liurongdi78569这是老板微信，只有微信才能找到她~"
    },
    {
        "district":  "宝安",
        "name":  "顺德双皮奶",
        "address":  "25区对面,公交站牌往前走一点",
        "dishes":  "双皮奶,其他的小吃也不错",
        "average":  "10",
        "rating":  "95",
        "note":  "位置很好找,夏天空调很给力"
    },
    {
        "district":  "宝安",
        "name":  "车轮饼小摊",
        "address":  "固戍F口下围园全汉创意1楼蜜雪冰城门口",
        "dishes":  "车轮饼各种口味",
        "average":  "10",
        "rating":  "99",
        "note":  "车轮饼各种口味都好吃，同档的淀粉肠也不错，夫妻都是听障人士，大家买东西指出来就好，"
    },
    {
        "district":  "宝安",
        "name":  "阿龙哥章鱼小丸子",
        "address":  "榕树路懂爱小面门口",
        "dishes":  "章鱼小丸子",
        "average":  "10",
        "rating":  "100",
        "note":  "超级好吃的章鱼丸子 每颗都有大大的章鱼"
    },
    {
        "district":  "宝安",
        "name":  "陕西老潼关肉夹馍",
        "address":  "榕树路潮汕中式快餐门口",
        "dishes":  "肉夹馍、凉皮、凉面",
        "average":  "10",
        "rating":  "98",
        "note":  "料非常足，加素菜还免费，和我在西安吃的味道一样，每次路过都会去买一个，老板人超级好。"
    },
    {
        "district":  "宝安",
        "name":  "柠檬树餐厅",
        "address":  "甲岸村门口旁边(海雅正门对面)",
        "dishes":  "菠萝包",
        "average":  "12",
        "rating":  "99",
        "note":  "可以多买几个 根本停不下来；我买过，好吃"
    },
    {
        "district":  "宝安",
        "name":  "森霓炸鸡柠檬茶（海雅店）",
        "address":  "甲岸村小罗臭豆腐巷子直走",
        "dishes":  "泰绿手打柠檬茶，鸭屎香柠檬茶，水蜜桃柠檬茶",
        "average":  "15",
        "rating":  "95",
        "note":  "美团秒杀8.5元一杯；豆腐超好吃"
    },
    {
        "district":  "宝安",
        "name":  "湖南怀化米粉",
        "address":  "坪洲地铁站B口直走左转麻布新村",
        "dishes":  "鸡杂拌粉",
        "average":  "15",
        "rating":  "100",
        "note":  "味道很正宗，价格便宜；能点外卖吗；福田cocopark的很难吃，肉少很腻"
    },
    {
        "district":  "宝安",
        "name":  "鹿十元饭团",
        "address":  "固戍地铁站d出口",
        "dishes":  "巨无霸饭团",
        "average":  "15",
        "rating":  "待补充",
        "note":  "好吃，干净又卫生。早上6点-10点开门"
    },
    {
        "district":  "宝安",
        "name":  "无名路边斩料快餐",
        "address":  "翻身地铁口C口出来的公交站旁",
        "dishes":  "白切鸭，猪粉肠，多种多样斩料可双拼15元",
        "average":  "15",
        "rating":  "88",
        "note":  "从游泳馆回来时路过，饥肠辘辘看着摆在公交站的小摊有节奏刀劈斩料的声音忍不住上前品鉴，环境在户外，人流被停放单车隔开，不影响就餐。汤跟饭满分无限续！沙姜蘸酱无敌下饭！15块钱双拼超值！关于时间估计只有晚上出来摆摊，晚上8点后！"
    },
    {
        "district":  "宝安",
        "name":  "柳螺香螺蛳粉",
        "address":  "桥头地铁站附近步行几百米",
        "dishes":  "螺蛳粉！！吃过深圳最好吃最香的螺蛳粉，吃了几十次了都没腻",
        "average":  "15",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "董记化州冰冻糖水店",
        "address":  "新安公园地铁站，甲岸村里，别走错了，他们家对面有一家也是化州糖水。",
        "dishes":  "很火的，小红书一搜全都是，都好吃",
        "average":  "20",
        "rating":  "100",
        "note":  "坐在店里看墙上的大字报可以看出面对面两家的暗暗较量哈哈哈很好玩。\n确实。；超级好喝的"
    },
    {
        "district":  "宝安",
        "name":  "麻辣烫",
        "address":  "甲岸村里面，好像在上面这个对面a",
        "dishes":  "就麻辣烫",
        "average":  "20",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "紫金八刀汤",
        "address":  "新安街道办对面",
        "dishes":  "八刀汤+米粉",
        "average":  "20",
        "rating":  "90",
        "note":  "味道不错,价格也不贵"
    },
    {
        "district":  "宝安",
        "name":  "现捞鸭脖（宝安店）卤流香",
        "address":  "地址  俺也不知道 线上点单   宝安中心附近基本都可以送",
        "dishes":  "鸭爪",
        "average":  "20",
        "rating":  "99",
        "note":  "sms15627289777  微信号"
    },
    {
        "district":  "宝安",
        "name":  "小胜咖啡（灵芝店）",
        "address":  "新安街道建安一路338-4，灵芝地铁a出口直走100m左右",
        "dishes":  "精品咖啡，甜心拿铁和茉莉美式香甜到心坎里",
        "average":  "20",
        "rating":  "90",
        "note":  "出了名的mini店铺，咖啡出品质量碾压大牌，用的牛奶都超级好，性价比拉满。"
    },
    {
        "district":  "宝安",
        "name":  "石磨竹窝肠粉",
        "address":  "富怡花园1楼",
        "dishes":  "超薄超香的花生油",
        "average":  "20",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "私厨炒粉炒螺",
        "address":  "流塘榕树路",
        "dishes":  "紫苏牛蛙 酸笋田螺 干炒河粉",
        "average":  "20",
        "rating":  "100",
        "note":  "超正的路边摊炒粉 炒螺、没有太多的调料，一定趁热吃！"
    },
    {
        "district":  "宝安",
        "name":  "有间冰（西乡店）",
        "address":  "西乡步行街真理街2巷3-1号",
        "dishes":  "特色甲子冰花，雪花冰。超平价",
        "average":  "20",
        "rating":  "100",
        "note":  "性价比很高，酸甜水果冰花很解腻这个夏天值得拥有；特威楼下；超级好吃！同意+1"
    },
    {
        "district":  "宝安",
        "name":  "砂锅麻辣烫",
        "address":  "甲岸村进去路口左边的,路边有个大冰箱",
        "dishes":  "都很好吃,还有烧烤",
        "average":  "25",
        "rating":  "90",
        "note":  "30一大锅,吃完扶墙走级别"
    },
    {
        "district":  "宝安",
        "name":  "阿嬷手作",
        "address":  "好多商圈都有",
        "dishes":  "龙眼栀子椰 清补凉 米麻薯 雪糕",
        "average":  "25",
        "rating":  "90",
        "note":  "可以小程序提前点单 周末通常要等"
    },
    {
        "district":  "宝安",
        "name":  "鸡鸣汤包渔舟渡",
        "address":  "宝安区新安四路店",
        "dishes":  "鸡汁汤包、蟹粉汤包、鸡丝馄钝、",
        "average":  "30",
        "rating":  "满分！",
        "note":  "复议*2；不错"
    },
    {
        "district":  "宝安",
        "name":  "蕉记牛杂煲仔饭",
        "address":  "新华一路兴盛商务中心",
        "dishes":  "牛杂，各类煲仔饭",
        "average":  "30",
        "rating":  "80",
        "note":  "强推牛肉拼滑鸡煲仔饭；20"
    },
    {
        "district":  "宝安",
        "name":  "二小阿姨炸串",
        "address":  "坪洲,巡抚街133号",
        "dishes":  "炸串,薯片必点",
        "average":  "30",
        "rating":  "99",
        "note":  "下了地铁要走很嗨远,提前找人去排队,真的很多人,要等好久；有点远略一般；很一般，不如小摊的炸串"
    },
    {
        "district":  "宝安",
        "name":  "文叔湖北菜",
        "address":  "华强北，世界之窗，黄贝岭",
        "dishes":  "热干面超好吃",
        "average":  "30",
        "rating":  "100",
        "note":  "深圳属于最正宗的湖北莲藕汤 和热干面了"
    },
    {
        "district":  "宝安",
        "name":  "好好食堂",
        "address":  "新安公园地铁站，甲岸村里，别走错了。（复制上面的 都是里面",
        "dishes":  "饭团 咖啡",
        "average":  "30",
        "rating":  "90",
        "note":  "主要是环境真的好，适合拍照约会！"
    },
    {
        "district":  "宝安",
        "name":  "西乡路口路边摊私厨XL烤苕皮烤冷面炒田螺",
        "address":  "流塘榕树路（晚上10点出摊）",
        "dishes":  "火鸡烤冷面，烤生蚝",
        "average":  "30",
        "rating":  "100",
        "note":  "推荐一定要尝一下芝士火鸡烤冷面微辣版"
    },
    {
        "district":  "宝安",
        "name":  "东北炭火烧烤",
        "address":  "流塘榕树路",
        "dishes":  "牛肉大串，羊肉大串，蚕蛹，蚂蚱",
        "average":  "30",
        "rating":  "100",
        "note":  "食材干净，新鲜，串大，味道好，正宗东北烧烤味道"
    },
    {
        "district":  "宝安",
        "name":  "两王一炸炸串",
        "address":  "流塘榕树路柴火鸡门口",
        "dishes":  "鸡腿，鸡翅，香辣鸡胗，俏皮，脆骨肠，鸡肉大串，牛肉大串，",
        "average":  "30",
        "rating":  "100",
        "note":  "各种串串都有，外脆里嫩！"
    },
    {
        "district":  "宝安",
        "name":  "重庆刘氏牛肉面",
        "address":  "后瑞 盈德丰商务大厦店",
        "dishes":  "随便一碗面就很好吃了",
        "average":  "30",
        "rating":  "99",
        "note":  "去过了，不好吃"
    },
    {
        "district":  "宝安",
        "name":  "点品集你",
        "address":  "沙井附近，可直接搜索【点品集】",
        "dishes":  "药膳鸡脚、蒜蓉鸡翅尖、炸云吞以及所有甜品",
        "average":  "30",
        "rating":  "95",
        "note":  "人很多，排队需要很久  早点去   糖水都是5-10块钱左右，开车进沙井需要收费"
    },
    {
        "district":  "宝安",
        "name":  "好好食堂",
        "address":  "甲岸村里面 直走 第一个路口右拐 再第二个路口左拐",
        "dishes":  "明太子饭团 奶油炖菜",
        "average":  "40",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "新宝餐厅/新世界茶餐厅",
        "address":  "宝安很多地方都有",
        "dishes":  "套餐都不错挺划算的/柠檬茶很嗯",
        "average":  "45",
        "rating":  "90",
        "note":  "周末人多,空调很冷,多穿点去!"
    },
    {
        "district":  "宝安",
        "name":  "板凳地摊烤肉",
        "address":  "翻身b口导航走个五百米",
        "dishes":  "酸菜五花肉，烤肠，鸡脆骨...鲜牛肉",
        "average":  "50",
        "rating":  "95",
        "note":  "卫生不是很干净，吃的时候能看到老鼠在旁边跑；懒大王你好"
    },
    {
        "district":  "宝安",
        "name":  "友时咖啡",
        "address":  "坪洲地铁附近",
        "dishes":  "手冲咖啡 柠檬芝士蛋糕",
        "average":  "50",
        "rating":  "95",
        "note":  "坪洲吃的多，但好吃的少，精品咖啡少。友时是精品咖啡，店内环境好，小众，价位中等，老板nice。"
    },
    {
        "district":  "宝安",
        "name":  "大自然醉鹅（宝安翻身店）",
        "address":  "兴华一路华创达现代服务产业园C109号",
        "dishes":  "鹅",
        "average":  "50",
        "rating":  "98",
        "note":  "抖音美团都有套餐，周末去都是要排队的，工作日吃还好，味道不错"
    },
    {
        "district":  "宝安",
        "name":  "串掌门砂锅串串香",
        "address":  "后瑞地铁站B口",
        "dishes":  "鸡肉串必选",
        "average":  "50",
        "rating":  "98",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "伟记东北烧烤",
        "address":  "11号线桥头A出口200米",
        "dishes":  "鸡翅、骨肉相连、羊排、鸡腿、鲜虾、都很好吃",
        "average":  "50",
        "rating":  "100",
        "note":  "开心/周二群内客户到店撸串尊享全单8.8折优惠。😊(群友到店买单出示会员群，并发送：已到店）"
    },
    {
        "district":  "宝安",
        "name":  "屋头串串香（川味）",
        "address":  "宝安区流塘地铁站B1出口，步行穿过前进二路300米左右",
        "dishes":  "锅底可单选辣度和麻度，较友好，按竹签和盘子数量计费，菜品丰富都自选",
        "average":  "50",
        "rating":  "90",
        "note":  "对比此条街多家火锅，此家锅底最好吃，注意避雷隔壁家，菜品不新鲜"
    },
    {
        "district":  "宝安",
        "name":  "渔佐寿司",
        "address":  "宝安坪洲c出口",
        "dishes":  "蟹棒，寿司船",
        "average":  "60",
        "rating":  "99",
        "note":  "单人套餐非常一般，评论第一的薯泥加了薯片碎味道非常奇怪。虾寿司感觉虾味道不足，没有海鲜的嫩滑爽口的感觉。他们家价钱不贵，所以味道也真的就这样吧。环境也一般般，店面不大。不推荐（2024.8.3）"
    },
    {
        "district":  "宝安",
        "name":  "乐闹闹火锅",
        "address":  "宝安坪洲c出口",
        "dishes":  "火锅",
        "average":  "60",
        "rating":  "80",
        "note":  "21"
    },
    {
        "district":  "宝安",
        "name":  "路边摊烧鸟",
        "address":  "翻身B口，定位金汇名园，摊位在十字路口上，晚上十点左右出摊",
        "dishes":  "鳗鱼、菠萝牛肉、京葱鸡肉、番茄五花肉、明太子西葫芦、提灯！",
        "average":  "60",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "老何湖南烧烤",
        "address":  "灵芝地铁站",
        "dishes":  "牛油，罗非鱼，多春鱼，玉米",
        "average":  "60",
        "rating":  "90o(￣▽￣)ｄ",
        "note":  "环境差，老板服务超好，去过N次，有空还会去"
    },
    {
        "district":  "宝安",
        "name":  "米禾MIHE 美食音乐酒馆 (固成店)",
        "address":  "西乡街道固成二路间头新村8号，地铁F口出来，",
        "dishes":  "烤鸡非常不错，其他一般水平",
        "average":  "68",
        "rating":  "烤鸡95分",
        "note":  "烤鸡外脆里嫩，还有汁，非常好吃，"
    },
    {
        "district":  "宝安",
        "name":  "壹号烧烤蚝庄",
        "address":  "沙井地铁站C口步行860m(大众点评有详细地址）",
        "dishes":  "生蚝，鸡腿，羊腰子",
        "average":  "70",
        "rating":  "85",
        "note":  "堂食堂食堂食！外卖不好吃，推荐附近的来吃就行，只能说是在沙井算是出彩，生蚝很新鲜，每个菜品都在及格线上"
    },
    {
        "district":  "宝安",
        "name":  "云山渡晓",
        "address":  "宝安中心壹方城5楼",
        "dishes":  "各种牛肉",
        "average":  "70",
        "rating":  "90",
        "note":  "物美价廉；感觉一般耶；确实一般般；一般般+"
    },
    {
        "district":  "宝安",
        "name":  "满胜三毛砂锅粥",
        "address":  "流塘店",
        "dishes":  "虾蟹砂锅粥(可以随意点拼着煮)炸豆腐、炒花甲、铁板鱼肚",
        "average":  "70",
        "rating":  "100",
        "note":  "砂锅粥yyds，现点现煮很鲜美，螃蟹虾粥真的好吃到不行。他们家烧烤也好吃！！；没搜到，24.3.23"
    },
    {
        "district":  "宝安",
        "name":  "夏家小院",
        "address":  "固戍a口",
        "dishes":  "血鸭、粉蒸鹅等",
        "average":  "70",
        "rating":  "90",
        "note":  "湘菜馆，菜品有本地（永州）特色味道，非常好吃，特别下饭，米饭品质差一点"
    },
    {
        "district":  "宝安",
        "name":  "姜胖胖自助烤肉（新桥店）",
        "address":  "沙井地铁口附近，在佳漾汇里面",
        "dishes":  "自助种类挺多的，性价比很高，还可以另点单要炸鸡 火锅 冷面（冷面很好吃）",
        "average":  "70",
        "rating":  "95",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "云山晓渡潮汕牛肉火锅",
        "address":  "宝安壹方城（很多地铁站都到）",
        "dishes":  "好吃啊好吃，最好吃的雪花牛肉没吃到，但其他的肉也很靓",
        "average":  "70",
        "rating":  "95",
        "note":  "可以早点去，替我吃吃雪花牛"
    },
    {
        "district":  "宝安",
        "name":  "屋头串串香",
        "address":  "流塘地铁站",
        "dishes":  "鸡胸肉，苕粉，贡菜",
        "average":  "75",
        "rating":  "95",
        "note":  "物美价廉！好吃不贵！铁甲小子推荐！"
    },
    {
        "district":  "宝安",
        "name":  "丫班东北烧烤",
        "address":  "12号线上川站B1出口10米",
        "dishes":  "五花肉、东北大油边、馒头片",
        "average":  "77",
        "rating":  "95",
        "note":  "18"
    },
    {
        "district":  "宝安",
        "name":  "川胖子美蛙鱼头",
        "address":  "上合小学对面",
        "dishes":  "美蛙鱼头火锅（要排队很久，最好早点去",
        "average":  "80",
        "rating":  "90（因为等了好久",
        "note":  "可以提前点菜，上小红书看一下大概要怎么点"
    },
    {
        "district":  "宝安",
        "name":  "光仔肥牛",
        "address":  "崛起实验中学对面",
        "dishes":  "炭烤肥牛,点套餐也不错",
        "average":  "80",
        "rating":  "95",
        "note":  "吃很多次了,错峰去最好!"
    },
    {
        "district":  "宝安",
        "name":  "乡村铁锅炖（雅涛花园店）",
        "address":  "坪洲地铁站D口两百米，大仟里附近。",
        "dishes":  "排骨锅，宽豆角，东北细粉条，榛蘑。凉菜三丝。",
        "average":  "80",
        "rating":  "90",
        "note":  "实惠又好吃，花卷是生的面在锅里现蒸熟的，特别好吃！推荐人吃了一年多，大概去了十次左右，推荐给很多朋友了。可以提前给老板打电话让他们先做。美团有套餐，130的2-3人餐，额外加份东北细粉条，4个人都够吃～"
    },
    {
        "district":  "宝安",
        "name":  "槿柇韩国料理（坪洲店）",
        "address":  "坪洲麻布新村7巷10号，大仟里附近。",
        "dishes":  "韩式辣鸡爪！！！！无骨炸鸡！！！！巨好吃巨好吃巨好吃！主菜部队选火锅或者芝士排骨鸡爪锅都可以～",
        "average":  "80",
        "rating":  "90",
        "note":  "也是吃了一年多，推荐给很多朋友了，老板娘是东北人，性格挺好，挺爱聊天的。；味道感觉一般般；辣汁蛤蜊也好吃"
    },
    {
        "district":  "宝安",
        "name":  "海乐棠•128香辣虾•蛙蛙肥肠鱼",
        "address":  "海城路126号，坪洲站c口50米，大仟里附近。",
        "dishes":  "芸豆糯香鸭掌！！！！！！给我吃！巨好吃！",
        "average":  "80",
        "rating":  "90",
        "note":  "微辣也挺辣的，但是真的很好吃！可以喝酒摇骰子，营业到三点。"
    },
    {
        "district":  "宝安",
        "name":  "为你而烤*烧烤",
        "address":  "坪洲地铁站D口直走过个红绿灯在直走一点右转",
        "dishes":  "住附近，这家已经倒闭",
        "average":  "80",
        "rating":  "98",
        "note":  "团购 163元四人餐 分量足 因为性价比很高 当时个人去还有一大半没吃完；去过了，不好吃"
    },
    {
        "district":  "宝安",
        "name":  "大鸽饭",
        "address":  "坪洲大仟里4楼",
        "dishes":  "鸽子饭、烤乳鸽",
        "average":  "80",
        "rating":  "100",
        "note":  "好吃好吃超好吃，就是周末难等位；红烧乳鸽好吃"
    },
    {
        "district":  "宝安",
        "name":  "壹号粥粥底火锅",
        "address":  "宝安灵芝店（灵芝地铁站出来一点几公里）",
        "dishes":  "自选菜品，爱吃什么拿什么。嫩牛肉一点要点！",
        "average":  "80",
        "rating":  "95",
        "note":  "车位少不好停车，菜品都新鲜，座位很多，一般不排队"
    },
    {
        "district":  "宝安",
        "name":  "新蚝家菜馆",
        "address":  "沙井京基百纳南门斜对面",
        "dishes":  "金银蒜石锅蚝！这个是真的香，而且生蚝肉质很Q弹",
        "average":  "85",
        "rating":  "90",
        "note":  "老店原班人马搬迁过来的，口味也一起带过来，20多年还是很多新花样吃法"
    },
    {
        "district":  "宝安",
        "name":  "壹号粥火锅（海鲜煲仔粥）",
        "address":  "灵芝地铁站A2口570m",
        "dishes":  "生蚝、活虾、脆肉皖",
        "average":  "88",
        "rating":  "90",
        "note":  "菜品非常新鲜，可以预订"
    },
    {
        "district":  "宝安",
        "name":  "山河屯铁锅炖",
        "address":  "西乡沃尔玛附近",
        "dishes":  "必须排骨锅啊，还有锅贴 面藕",
        "average":  "100",
        "rating":  "99",
        "note":  "可以提前预约，不预约的话大概要顿个半小时左右"
    },
    {
        "district":  "宝安",
        "name":  "海南东山羊庄",
        "address":  "沙井壆岗地铁站附件一家超大的店（其他店的海南东山羊不行）",
        "dishes":  "羊肉火锅",
        "average":  "100",
        "rating":  "100",
        "note":  "汤底是简单的羊骨汤，加了甘蔗煮微甜很好喝，熬了很久是奶白色汤底，冬天吃了很暖和；吃了，肉比较假"
    },
    {
        "district":  "宝安",
        "name":  "啫两手.粤菜.啫啫煲",
        "address":  "新安街道自由路翻身社区49号燊达汇B区101（维也纳新安店停车场入口处）",
        "dishes":  "沙姜啫盐焗鸡 、牛肉粒",
        "average":  "100",
        "rating":  "90",
        "note":  "作为粤菜来说，用砂锅煲的形式展示出来的食物 锅气十足；一般般；确实很一般，不值得"
    },
    {
        "district":  "宝安",
        "name":  "惦记里铜锅涮肉",
        "address":  "西乡站附近",
        "dishes":  "辣锅（必选），各种肉，酸菜解腻",
        "average":  "100",
        "rating":  "100",
        "note":  "这个辣锅涮皮鞋都好吃"
    },
    {
        "district":  "宝安",
        "name":  "春河酒馆",
        "address":  "固戍地铁站A口",
        "dishes":  "春河特调（一杯倒）",
        "average":  "120",
        "rating":  "100",
        "note":  "喜欢玩/听音乐的朋友有福了，酒馆里吉他键盘架子鼓贝斯一应俱全，可以一起喝酒玩耍，酒的价格也不贵！铁甲小子推荐！"
    },
    {
        "district":  "宝安",
        "name":  "果林椰子鸡（新安店）",
        "address":  "灵芝地铁站C1出口π mall中洲购物中心4楼",
        "dishes":  "深圳最好吃的椰子鸡",
        "average":  "120",
        "rating":  "90",
        "note":  "深圳最好吃的椰子鸡了吧。他们的宝安总店更好吃，只是不近地铁站，可以大众点评搜到地址。"
    },
    {
        "district":  "宝安",
        "name":  "芸山季·云南野生菌火锅",
        "address":  "海雅缤纷城5楼",
        "dishes":  "土鸡菌汤锅、铜锅宣威火腿牛肝菌焖饭",
        "average":  "122",
        "rating":  "待补充",
        "note":  "超级超级无敌鲜，羡慕云南人的一天！菌子和火腿绝配！"
    },
    {
        "district":  "宝安",
        "name":  "汶和记粥底火锅",
        "address":  "新安街道海裕社区83区宝安体育场2号铺",
        "dishes":  "待补充",
        "average":  "126",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "横纲日式烧肉",
        "address":  "壹方城",
        "dishes":  "厚切牛舌啊啊啊啊啊啊、横膈膜啊啊啊啊、烤年糕啊啊啊啊啊、炭烤大虾、刺身",
        "average":  "300",
        "rating":  "100",
        "note":  "昭仪强烈推荐！！！！！！！！这家烧肉真的好好吃啊，肉质非常新鲜，隔壁的水产店也是他们的，所以也很值得点点刺身、海鲜什么的，超级新鲜，日式烧肉里面真的这家性价比很高了；不信，除非请我吃"
    },
    {
        "district":  "宝安",
        "name":  "盐田社区夜市文化街",
        "address":  "西乡地铁站，步行到金海路-下三村小区",
        "dishes":  "待补充",
        "average":  "10-100",
        "rating":  "85",
        "note":  "特色小吃摊很多，慢慢逛慢慢选；赞同，人最多的花甲粉很不错，味道可以，花甲很多，还没有沙子；人最多的那家花甲粉好吃！"
    },
    {
        "district":  "宝安",
        "name":  "潮味酥脆鸡锁骨",
        "address":  "固戍F口出来维也纳酒店到大榕树这条街随机摆摊",
        "dishes":  "炸鸡尖超绝",
        "average":  "10～20",
        "rating":  "99",
        "note":  "炸鸡尖我的爱，每周必吃三次，鸡尖很肥，肉很多！味道也超好！"
    },
    {
        "district":  "宝安",
        "name":  "品味饺子",
        "address":  "宝安西乡盐田街",
        "dishes":  "饺子皮薄馅大特别好吃，手擀面也特别香",
        "average":  "15-20",
        "rating":  "99",
        "note":  "推荐酸菜馅和青椒肉丝的手擀面"
    },
    {
        "district":  "宝安",
        "name":  "潮汕粿条",
        "address":  "海雅大剧院对面,网吧往前走的路口",
        "dishes":  "猪肉粿条,米粉",
        "average":  "20-25",
        "rating":  "99",
        "note":  "每周必吃,很入味,很正宗"
    },
    {
        "district":  "宝安",
        "name":  "盐田夜市炸菇",
        "address":  "宝安区海富社区南三巷5号102",
        "dishes":  "炸金针菇 平菇",
        "average":  "20-30",
        "rating":  "85",
        "note":  "多撒粉！！"
    },
    {
        "district":  "宝安",
        "name":  "步步的冰屋",
        "address":  "坪洲地铁站D口，直走过红绿灯再直走到新疆羊肉串右转进村，再导航下150m可达",
        "dishes":  "芒果、蓝莓绵绵冰好吃！！！",
        "average":  "28-50",
        "rating":  "95",
        "note":  "店主小红书发老公出轨了，后续不知道会不会换店名和logo，尽快去吃"
    },
    {
        "district":  "宝安",
        "name":  "稷良品日料",
        "address":  "翻身",
        "dishes":  "蟹棒 鳗鱼饭",
        "average":  "30-40",
        "rating":  "90",
        "note":  "环境好，老板服务超好，去过两次，有空还会去"
    },
    {
        "district":  "宝安",
        "name":  "佰福记东北麻辣烫",
        "address":  "宝安区固戍二路新天地产业园A9栋115",
        "dishes":  "爱麻酱的记得让老板多加，炸串偏咸，可以问下老板可不可以淡一些",
        "average":  "30-40",
        "rating":  "100",
        "note":  "会排队哦，东北人真的很满意"
    },
    {
        "district":  "宝安",
        "name":  "四禧潮鸡煲",
        "address":  "坪洲地铁站 跟导航走吧",
        "dishes":  "无花果脆皮鸡煲 蚝烙",
        "average":  "70-80",
        "rating":  "99",
        "note":  "广东胃必吃！爱吃椰子鸡的去试试 汤超甜 我能喝好几碗汤 蚝烙的蚝也挺大的；无花果鸡煲甜到腻了！个人觉得很糟糕"
    },
    {
        "district":  "宝安",
        "name":  "食味厨·地道湖南菜",
        "address":  "西乡 b出口出来直行到第一个十字路口右转走几百米右手边就能看到",
        "dishes":  "剁椒鱼头，小炒黄牛肉和藕汤",
        "average":  "70~80",
        "rating":  "89",
        "note":  "办会员19.9就能买到一大盘剁椒鱼头，另外只推荐小炒黄牛肉和藕汤，他家藕汤真的是好喝，小炒黄牛肉很下饭，他家鸭子做的很难吃，快给我牙崩掉了"
    },
    {
        "district":  "宝安",
        "name":  "桥南王记串店",
        "address":  "合水口花园西一巷7号",
        "dishes":  "醉岛老板波波推荐",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "肆季茶事（奶茶店）",
        "address":  "流塘榕树路",
        "dishes":  "泰绿柠檬茶、牛油果草莓、牛油果甘露",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "香米煲仔饭",
        "address":  "上川村里（洪浪北C口出）",
        "dishes":  "啥都好吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "华记猪肚鸡",
        "address":  "宝安区-宝民二路青春庭园121号，港隆购物城边上",
        "dishes":  "猪肚鸡、脆肉脘",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "猪肚鸡的汤贼好喝"
    },
    {
        "district":  "宝安",
        "name":  "七个烧烤",
        "address":  "翻身B口",
        "dishes":  "烤串都可以",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "个人觉得一般；好好吃，最爱蟹脚面"
    },
    {
        "district":  "宝安",
        "name":  "木先生粉面馆",
        "address":  "石岩街道石龙仔新村，海友酒店隔壁，高德可直接导航",
        "dishes":  "肥肠面，牛肉面，酸辣粉都好吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "龙珠肠粉",
        "address":  "龙珠花园公共厕所旁边",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "这家被朋友夸爆了"
    },
    {
        "district":  "宝安",
        "name":  "幺娃老火锅",
        "address":  "沙井京基百纳对面",
        "dishes":  "火锅，份量挺大的",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "好吃！"
    },
    {
        "district":  "宝安",
        "name":  "双门洞韩国料理",
        "address":  "固戍a口",
        "dishes":  "韩料好吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "一般"
    },
    {
        "district":  "宝安",
        "name":  "firsthalf 小酒馆",
        "address":  "沙井地铁站 清平古墟里面",
        "dishes":  "鸡尾酒出品很好而且很便宜，而且店里面氛围超棒，很chill，而且面食特别好吃，肥牛乌冬面和中式腊肠咸芝士意面很有特色，还适合小酌聊天玩桌游",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "南巷south alley",
        "address":  "沙井地铁站d口 清平古墟入口里面",
        "dishes":  "白天有柠檬茶很不错，晚上有精酿罐子和生啤，最重要是每周六有爵士乐演出！都是很高水平的乐手",
        "average":  "待补充",
        "rating":  "95",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "化州肥仔大排档",
        "address":  "5号线翻身站开屏花园正门直走",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "老郑家东北春饼店（怀德万象汇店）",
        "address":  "菜量超小，没几片肉，避雷避雷避雷",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "宝安",
        "name":  "爷爷的红柳（烤肉店）",
        "address":  "新安洪浪北地铁B口出来走400米，地图能搜到，Tata公寓旁边",
        "dishes":  "建议点最大的那种羊肉串，大满足，\n可以要皮牙子，现穿现烤，好吃不贵，",
        "average":  "50",
        "rating":  "待补充",
        "note":  "主要吃羊肉串的，一家新疆同胞开的街坊店，五六年前来的时候它就在，肉好吃不贵，建议点最大的那种羊肉串，可以要皮牙子"
    },
    {
        "district":  "宝安",
        "name":  "化州鸡大排档（宝安总店）",
        "address":  "新安翻身地铁口B出口，二天堂大药房旁边",
        "dishes":  "化州香油捞粉，化州香油鸡，椒盐排骨",
        "average":  "60",
        "rating":  "待补充",
        "note":  "典型的化州菜大排档"
    },
    {
        "district":  "宝安",
        "name":  "化州剪牛杂牛腩",
        "address":  "新安街道宝民一路122号103",
        "dishes":  "剪牛杂，香油捞粉",
        "average":  "50",
        "rating":  "待补充",
        "note":  "大锅里的牛杂，有喜欢吃的和不吃的可以跟老板娘讲，不讲的话就随机剪牛杂给你了，还可以要碗汤\n比如我不吃肥肠和牛腩，太肥了哈哈哈"
    },
    {
        "district":  "宝安",
        "name":  "冰杰小罗臭豆腐",
        "address":  "灵芝地铁站/新安公园地铁站，甲岸村1栋109-111",
        "dishes":  "臭豆腐你们就吃吧！夯爆了！！酸萝卜也好吃。小罗夯中夯！",
        "average":  "10",
        "rating":  "满分是多少小罗就是多少",
        "note":  "必须要拿到手立马吃，脆脆的口感加上美味的汤汁，完全顶级美味。！不要打包不要打包不要打包！；支持小罗，拉踩隔壁家"
    },
    {
        "district":  "宝安",
        "name":  "大二街边粉",
        "address":  "沙井京基百纳旁边",
        "dishes":  "螺蛳粉螺蛳粉螺蛳粉木薯糖水也不错",
        "average":  "20-25",
        "rating":  "100分",
        "note":  "第一食堂"
    },
    {
        "district":  "宝安",
        "name":  "阿毛饭馆",
        "address":  "马安山D口附近",
        "dishes":  "大盘鸡大盘鸡！",
        "average":  "50",
        "rating":  "95",
        "note":  "吃到最后整两片烩面拌进去，只有一点，吃完会口渴，但是味道真是没的说，"
    },
    {
        "district":  "宝安",
        "name":  "五溪红小子·烧烤龙虾馆",
        "address":  "龙华区龙华街道景龙建设路天娱大厦1楼101（抖音能搜到）",
        "dishes":  "外婆菜蛋炒饭好吃！香辣蟹好吃！（蟹很新鲜，但是里面的年糕一般，可以备注不要太咸）",
        "average":  "100-150",
        "rating":  "90",
        "note":  "他家烧烤好吃，但是有点贵，排队很多，尽量早点来，或者很晚来"
    },
    {
        "district":  "宝安",
        "name":  "1988首尔小馆",
        "address":  "粤海街道科发路2号8-5号",
        "dishes":  "参鸡汤好喝！鸡肉很嫩，里面有糯米填充，海鲜饼要趁热吃，外脆里嫩",
        "average":  "50左右",
        "rating":  "95",
        "note":  "老板娘人很好，属于韩餐的家常菜，不是炸鸡那种"
    },
    {
        "district":  "宝安",
        "name":  "夏物茶国王面包屋·三明治",
        "address":  "龙岗区坂田街道南坑社区五和南路72号家和花园6栋104",
        "dishes":  "安格斯牛肉热压三明治！土豆泥！",
        "average":  "待补充",
        "rating":  "80（好吃，但是配送贵太贵了）",
        "note":  "只点过外卖，三明治很香，除非真的很近，不然配送费很贵，一开始没有那么贵的，后面涨了"
    },
    {
        "district":  "宝安",
        "name":  "纯K（塘朗店）",
        "address":  "留仙大道塘朗城广场西区L6层",
        "dishes":  "卤肉饭超好吃",
        "average":  "待补充",
        "rating":  "100分",
        "note":  "是个KTV，但是菜挺好吃的，特别是卤肉饭"
    },
    {
        "district":  "宝安",
        "name":  "好伙计煲仔饭",
        "address":  "宝安区大浪社区怡园路东三巷25-1号",
        "dishes":  "经典煲仔饭",
        "average":  "25",
        "rating":  "88分",
        "note":  "绝绝子"
    },
    {
        "district":  "宝安",
        "name":  "李炸炸蘸卤炸串",
        "address":  "宝安区渔业旧村二巷7号 坪洲地铁站D口",
        "dishes":  "豆制品和平菇最好吃还有掌中宝山姆梅花肉",
        "average":  "20",
        "rating":  "95分",
        "note":  "需要蘸卤可以提前打电话给老板预留"
    },
    {
        "district":  "南山",
        "name":  "花记遵义虾子羊肉粉",
        "address":  "西丽地铁站C口",
        "dishes":  "羊杂粉，羊肉面，牛肉也好吃",
        "average":  "一碗面18-30不等",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "何止料理",
        "address":  "深圳湾体育馆负一楼",
        "dishes":  "奶油乌冬面，其它的不好吃",
        "average":  "一份饭大概30-40",
        "rating":  "待补充",
        "note":  "玉子烧好吃呀！！网红店，节假日早点去；这里靠海上世界！！！吃完就去拍照美滋滋；555玉子烧和骰子牛肉好好吃的！替他们抱不平；可选菜品很少"
    },
    {
        "district":  "南山",
        "name":  "景象越南小卷粉",
        "address":  "西丽F口步行300米",
        "dishes":  "有豆角 猪肉 香菇 木耳卷粉，按自己口味选",
        "average":  "小份只要11，4小条",
        "rating":  "95",
        "note":  "很多人推荐，口碑不错"
    },
    {
        "district":  "南山",
        "name":  "海芳缘炭火烤肉东北春饼(西丽店)",
        "address":  "桃园B口",
        "dishes":  "凉拌菜（超大份）、牙签牛肉（还是羊肉不太记得了）、糖醋鱼、锅包肉",
        "average":  "人均50-65",
        "rating":  "85-90",
        "note":  "是我东北朋友带我去吃的！！！；这个地址查出来是一家地摊烧烤，是不是贴错啦"
    },
    {
        "district":  "南山",
        "name":  "成都钟姐钵钵鸡",
        "address":  "",
        "dishes":  "钵钵鸡随便选都好吃",
        "average":  "看你怎么拿了",
        "rating":  "满分",
        "note":  "广东化的钵钵鸡"
    },
    {
        "district":  "南山",
        "name":  "醉岛精酿酒馆",
        "address":  "到固戍自己导航，",
        "dishes":  "各种精酿酒水 小吃都很好吃好喝 老板很nice 深圳滚圈青年聚集地",
        "average":  "看你酒量多少",
        "rating":  "满分",
        "note":  "绝对值得一去的摇滚酒馆"
    },
    {
        "district":  "南山",
        "name":  "正宗重庆天福麻辣烫",
        "address":  "东角头",
        "dishes":  "巨好吃的麻辣烫",
        "average":  "丰俭由人",
        "rating":  "满分",
        "note":  "可以连着好几天都吃麻辣烫的程度，真的很好吃很喜欢；肠胃弱的拉肚子"
    },
    {
        "district":  "南山",
        "name":  "幸临食堂",
        "address":  "海岸城",
        "dishes":  "排骨、意面、热香饼必吃",
        "average":  "丰俭由人",
        "rating":  "满分",
        "note":  "幸邻食堂？好像7/19最后一天吧"
    },
    {
        "district":  "南山",
        "name":  "龙叔炒粉",
        "address":  "导航就有",
        "dishes":  "炒粉，深职必吃",
        "average":  "8-12块",
        "rating":  "满分",
        "note":  "晚上人很多，别饭点和门禁前排队；这个一般"
    },
    {
        "district":  "南山",
        "name":  "江小蛙豆花麻麻鱼",
        "address":  "福田区皇岗村上围楼201号(滨河大道辅路，会展中心对面)",
        "dishes":  "正宗重庆味道，活鱼活蛙，新鲜看得见",
        "average":  "80左右",
        "rating":  "满分",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "杨记隆府（深圳总店）",
        "address":  "南山区南新路南园村",
        "dishes":  "9.9重庆小面、杨记卤鹅、口水鸡、水煮牛肉、蹄花汤、麻辣猪脑、超级菠萝冰",
        "average":  "80到100",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "亮子铜锅涮肉",
        "address":  "南山站G出口步行到两三个路口左转，学府路荔芳村",
        "dishes":  "羊肉，牛肉，冻豆腐，酸菜，糖蒜。",
        "average":  "80到100",
        "rating":  "85",
        "note":  "中午不营业。性价比不错，羊肉70多一斤。福田也有分店。；经常吃，便宜又美味"
    },
    {
        "district":  "南山",
        "name":  "二叔牛肉火锅",
        "address":  "南头古城A口",
        "dishes":  "牛肉！牛河也还行。",
        "average":  "80到100",
        "rating":  "85",
        "note":  "性价比很好，某点评直接买套餐可以。味道比某合里好吃的。；很生气😤去了白洲店倒闭了！；好吃爱吃！"
    },
    {
        "district":  "南山",
        "name":  "江边边陶婆婆火锅",
        "address":  "粤海街道学府东路桂庙新村98栋102铺（经济发展部楼下）",
        "dishes":  "待补充",
        "average":  "80-100",
        "rating":  "92",
        "note":  "我有一次只点小吃，很便宜，且都好吃"
    },
    {
        "district":  "南山",
        "name":  "smelly cat",
        "address":  "南山街道南新路1173号",
        "dishes":  "水果茶、汉堡、意面",
        "average":  "7、80",
        "rating":  "92",
        "note":  "老友记主题餐厅"
    },
    {
        "district":  "南山",
        "name":  "冬阴功",
        "address":  "南山区文心一路52号(南山书城地铁站A口步行240米)",
        "dishes":  "猪颈肉、咖喱虾（咖喱汁配饭一绝）冬阴功汤也好喝！！！",
        "average":  "70-90",
        "rating":  "90",
        "note":  "南山、蛇口、宝安都有店；这家真的好吃"
    },
    {
        "district":  "南山",
        "name":  "汶和记粥底火锅",
        "address":  "保利城花园店（靠近南山书城）",
        "dishes":  "牛展 嫩牛肉 炸排骨 春卷 无骨鸡爪",
        "average":  "70 80左右",
        "rating":  "满分",
        "note":  "周末刚试过，好吃，花甲很新鲜"
    },
    {
        "district":  "南山",
        "name":  "旺旺小吃店",
        "address":  "东方科技大厦一楼",
        "dishes":  "葱姜炒蟹，鸭肠，炸果肉，炒牛河，鱼头豆腐汤。基本不踩雷。",
        "average":  "60到100",
        "rating":  "满分",
        "note":  "没有菜单，每天视食材而定，厨师就两个人，上菜慢，但是千万别催。"
    },
    {
        "district":  "南山",
        "name":  "负海拔咖喱店",
        "address":  "南山书城G口",
        "dishes":  "咖喱和饭都可以续，很香很好吃",
        "average":  "60+",
        "rating":  "90",
        "note":  "扣的10分是店里座位不多且偶尔会休息，去晚了要排很久，只能到店取号"
    },
    {
        "district":  "南山",
        "name":  "广隆蛋挞",
        "address":  "蛇口汽车站",
        "dishes":  "芝士蛋挞",
        "average":  "5闷一个",
        "rating":  "8",
        "note":  "一个刚好，两个会腻；这个算美食吗  顶多解饱；认真？"
    },
    {
        "district":  "南山",
        "name":  "桐坑牛肉店",
        "address":  "南山区学府路荔馨苑A2栋113铺",
        "dishes":  "五花趾汤",
        "average":  "50-100",
        "rating":  "90",
        "note":  "去之前美团搜电话问一下五花趾卖完没有，五花趾很紧俏"
    },
    {
        "district":  "南山",
        "name":  "八大四小",
        "address":  "桃园地铁站",
        "dishes":  "川湘菜",
        "average":  "50-100",
        "rating":  "90",
        "note":  "便宜好吃 人多更合适"
    },
    {
        "district":  "南山",
        "name":  "拾味拌老坛仔姜蛙",
        "address":  "桃园F口；南山H口；南山区南头街道田厦社区常兴路83国兴大101",
        "dishes":  "川湘菜",
        "average":  "50-100",
        "rating":  "90",
        "note":  "便宜好吃，人多更合适"
    },
    {
        "district":  "南山",
        "name":  "韩国炸酱面—友利家超市",
        "address":  "东角头地铁站a出口向下走到蛇口影剧院对面",
        "dishes":  "zui正宗的韩国料理，韩国客人很多，炸酱面和糖醋肉真的一级绝，\n吃了还想吃，就是分量很大",
        "average":  "50+",
        "rating":  "满分",
        "note":  "最好吃的韩国料理；疫情以后越爱越偷工减料了；感觉一般，不会去第二次；有平替（意思是他们家贵了）"
    },
    {
        "district":  "南山",
        "name":  "小林车轮饼",
        "address":  "南山站，广东省深圳市南山区南山大道2009号亿利达村3栋107",
        "dishes":  "芝士玉米、芋泥都好吃，",
        "average":  "4、5",
        "rating":  "88",
        "note":  "倒閉了！！！！！別去了！！！"
    },
    {
        "district":  "南山",
        "name":  "鱼你在一起（学府店）",
        "address":  "南山西丽茶光站步行800m",
        "dishes":  "米饭自取无限加，鱼好吃",
        "average":  "36+",
        "rating":  "90",
        "note":  "鱼很好吃，很下饭，就是贵了点；预制菜 调料包系列  真的很一般"
    },
    {
        "district":  "南山",
        "name":  "胖明粉馆",
        "address":  "",
        "dishes":  "各种螺蛳粉",
        "average":  "30+",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "万事宁·天塔王",
        "address":  "南山店桃园A口 福田店科学馆E口 宝安店翻身C口",
        "dishes":  "绿豆冰糕 泡芙 山楂糕 柠檬天塔王 麻薯天塔王",
        "average":  "20-40",
        "rating":  "93",
        "note":  "几乎每一款都很好吃"
    },
    {
        "district":  "南山",
        "name":  "莫阿哥柳州螺蛳粉",
        "address":  "南航店，南航公司公交站",
        "dishes":  "螺蛳粉 炸蛋 炸猪蹄",
        "average":  "20-30",
        "rating":  "99",
        "note":  "红油很足 味道很浓郁/但是已经关门了！！！"
    },
    {
        "district":  "南山",
        "name":  "八宝牛杂粉",
        "address":  "蛇口蛇口广场6号门出口处（距望海路步行69米、停车可定位蛇口广场停车场）",
        "dishes":  "牛杂粉，牛肠粉 (黄面容易坨)",
        "average":  "20-25-30一碗",
        "rating":  "4.5",
        "note":  "给的量很多，而且牛杂处理的挺干净的，没有臭味，不过店面比较小，饭点挺多人排队"
    },
    {
        "district":  "南山",
        "name":  "一期一会居酒屋",
        "address":  "留仙洞B口或西丽F口（旺棠小吃街） 地图可搜",
        "dishes":  "章鱼小丸子、刺身拼盘、烧鸟、朝鲜海螺",
        "average":  "200（丰俭由人，点面食、寿司应该会便宜一些）",
        "rating":  "100",
        "note":  "昭仪推荐，烧鸟hin好吃，最好提前定位哈；灌篮高手主题餐厅"
    },
    {
        "district":  "南山",
        "name":  "鸟鹏烧鸟居酒屋",
        "address":  "麦当劳(西丽店)对面/茶光D口",
        "dishes":  "烧鸟系列、葱盐牛舌、清酒",
        "average":  "200（丰俭由人，点面食、寿司应该会便宜一些）",
        "rating":  "100",
        "note":  "昭仪推荐，炭烤三文鱼头好7；刚去吃，好腻不好吃，现在品控变差了，没以前好"
    },
    {
        "district":  "南山",
        "name":  "pleace",
        "address":  "华侨城侨城北站（离b10不远）",
        "dishes":  "松饼、谷饲牛排、蛋挞、班尼迪克蛋",
        "average":  "200好像",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "阿内哥－古早味（青春家园店）",
        "address":  "南油地铁站附近",
        "dishes":  "啊嫲古早油饭绝绝子！真的很好吃！很到位，很香，\n潮汕人吃了很喜欢",
        "average":  "20+",
        "rating":  "80",
        "note":  "天气太冷不敢吃冰，那个油饭真的很绝！；去过，个人感觉觉得非常一般！"
    },
    {
        "district":  "南山",
        "name":  "小蛮人麻辣烫",
        "address":  "西丽F口步行200米",
        "dishes":  "麻辣烫了，按自己兴趣点。",
        "average":  "15~30丰俭由人",
        "rating":  "85",
        "note":  "比杨国福麻辣烫每斤便宜一块钱，还送饮料，环境卫生不错。"
    },
    {
        "district":  "南山",
        "name":  "好好味面馆",
        "address":  "蛇口东角头  海岸城也有",
        "dishes":  "云吞面，云吞捞面",
        "average":  "15-30",
        "rating":  "9",
        "note":  "听说开了很多年了；南头古城里面也有"
    },
    {
        "district":  "南山",
        "name":  "京味张烤鸭",
        "address":  "南山站G口出站走300m左右，天福麻辣烫旁边",
        "dishes":  "烤鸭，炒饼，贝勒烤肉，鸭汤，京味宫保鸡丁跟其他北方式炒菜，老北京酸奶。",
        "average":  "100多",
        "rating":  "85",
        "note":  "抖音有个五个人套餐性价比很高。某点评的双人套餐也可以，京味张深圳店很多，只推荐南山跟竹子林店。"
    },
    {
        "district":  "南山",
        "name":  "京庄涮羊肉",
        "address":  "南山大道南光城市花园2栋（11号线南山地铁站D口580m）",
        "dishes":  "手切上脑，一米板等各种羊肉，芝麻烧饼。",
        "average":  "100到150多",
        "rating":  "95",
        "note":  "味道真的很好，很好，就是小贵，罗湖也有家店。"
    },
    {
        "district":  "南山",
        "name":  "潮悦牛肉火锅",
        "address":  "西丽F口，广东省深圳市南山区西丽街道新围村194号102铺",
        "dishes":  "雪花一定要点！",
        "average":  "100-150丰俭由人",
        "rating":  "99",
        "note":  "自评深圳牛肉火锅Top1！肉质贼好贼新鲜！"
    },
    {
        "district":  "南山",
        "name":  "黑邮票爵士俱乐部",
        "address":  "华侨城创意园北区A5栋",
        "dishes":  "鸡尾酒",
        "average":  "100+",
        "rating":  "99",
        "note":  "蚊子有点多"
    },
    {
        "district":  "南山",
        "name":  "渝拆火锅",
        "address":  "大学城地铁站C口",
        "dishes":  "重庆火锅",
        "average":  "150",
        "rating":  "满分",
        "note":  "重庆人认证的重庆火锅，就像在重庆随便找一家味道好的火锅一样"
    },
    {
        "district":  "南山",
        "name":  "百分炸牛+梧桐",
        "address":  "南园地铁站附近",
        "dishes":  "炸牛排 牛排三明治 炸猪排不好吃",
        "average":  "150",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "青青泰国菜",
        "address":  "万科云城三期B区七栋",
        "dishes":  "牛排不错！冬阴功汤推荐 炒饭一般但也有7分",
        "average":  "150",
        "rating":  "90",
        "note":  "发大众点评送饮料 可以主动问问服务员"
    },
    {
        "district":  "南山",
        "name":  "乐宴北京铜炉火锅",
        "address":  "旺棠黄志强对面",
        "dishes":  "跟在北京吃的味道差不多",
        "average":  "150",
        "rating":  "待补充",
        "note":  "又贵又难吃系列"
    },
    {
        "district":  "南山",
        "name":  "牛百鲜.牛腩煲火锅",
        "address":  "tony k不会了（海昌大厦）披萨店",
        "dishes":  "牛腩煲、酸菜牛肉炒饭、黄喉、毛肚等",
        "average":  "100",
        "rating":  "满分",
        "note":  "这家真的好好吃！工作日有午市优惠价，分量也很足，很喜欢；不好吃  纯属小红书美食  去一次不吃第二次  分量很足是萝卜放了3斤  然后一点点牛杂  全吃萝卜了  性价比很低"
    },
    {
        "district":  "南山",
        "name":  "夜郎国",
        "address":  "南光路122-2号南洋酒业旁（9号线南山书城B扣320m）",
        "dishes":  "招牌蛙yyds、凉拌米皮、土豆泥",
        "average":  "100",
        "rating":  "99.9",
        "note":  "蛙煲巨好吃！土豆泥欲罢不能！！他们菜系是贵州菜！(大卷"
    },
    {
        "district":  "南山",
        "name":  "小楠记",
        "address":  "南山区文华路科技苑34区饭多多美食汇深夜有居楼下",
        "dishes":  "粤菜馆，虾饼，炒花甲，鸡煲",
        "average":  "100",
        "rating":  "90",
        "note":  "越来越火，早点去避免排队；这还真的很好吃！"
    },
    {
        "district":  "南山",
        "name":  "潮香四海",
        "address":  "蛇口，工业八里路与四来路交叉口，定位玫瑰园",
        "dishes":  "请人吃饭不会出错的选择",
        "average":  "100",
        "rating":  "75",
        "note":  "排队太多人，环境较差"
    },
    {
        "district":  "南山",
        "name":  "大目牛肉火锅",
        "address":  "文光村里",
        "dishes":  "潮汕人认证，青沙茶好吃",
        "average":  "100",
        "rating":  "99",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "七月柿",
        "address":  "找离你最近的",
        "dishes":  "西红柿沙拉、潮汕牛肉煲",
        "average":  "100",
        "rating":  "95",
        "note":  "属于创新菜里做的很好的，不像别家创意菜会为了创新强融食材，调味还是很有意思。强烈安利西红柿沙拉，风干西红柿口感很特别。属于还会再去试新菜的餐厅～"
    },
    {
        "district":  "南山",
        "name":  "杨贺齐齐哈尔家庭烤肉",
        "address":  "大新地铁站D口往正新鸡排那边走",
        "dishes":  "招牌原味拌肉、五花肉、酸菜",
        "average":  "96",
        "rating":  "满分",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "祥和清远鸡煲",
        "address":  "南头店，最近地铁站大新A出口",
        "dishes":  "五指毛桃锅底配清远脆皮鸡，再蘸上店家调的料，绝！汤特别鲜美，肌肉脆嫩超好吃，吃辣和不吃辣的都可以冲，自己调辣度",
        "average":  "90",
        "rating":  "100",
        "note":  "两三个人点一个锅就差不多够了，先吃再加菜"
    },
    {
        "district":  "南山",
        "name":  "福康咖啡酒馆",
        "address":  "大新站A口步行560米",
        "dishes":  "调酒还有赤耳的酒",
        "average":  "80",
        "rating":  "满分",
        "note":  "店内装饰真的很有特点"
    },
    {
        "district":  "南山",
        "name":  "山禾田",
        "address":  "南头古城里面，南门进之后右转往前走的右手边",
        "dishes":  "日料店，牛油果拌饭，舒芙蕾",
        "average":  "80",
        "rating":  "80",
        "note":  "这家挺网红的，节假日得早点去，不然排队得排很久；食材一般，就占个便宜；吃过一次，感觉除了舒芙蕾，其他就是正常日料店水平；赞同前面"
    },
    {
        "district":  "南山",
        "name":  "胖子牛蹄",
        "address":  "沙河街道华夏街社区潮洲西街22号华侨城公交公司综合楼201",
        "dishes":  "牛蹄，一定要加牛舌！信我！",
        "average":  "80",
        "rating":  "80",
        "note":  "海鲜也不错，很新鲜"
    },
    {
        "district":  "南山",
        "name":  "顾记老贵阳肠旺面花溪牛肉粉",
        "address":  "沙河街道天鹅湖三期欢乐时光商场L1层023（扶手电梯旁左手边第一家）",
        "dishes":  "肠旺面，烙锅，洋芋粑，都不错，烙锅晚上5点后才有，",
        "average":  "80",
        "rating":  "75",
        "note":  "贵州人认可，价格偏贵，对比贵州当地的烙锅，边上有家贵阳糯米饭也不错，也是他家做的，"
    },
    {
        "district":  "南山",
        "name":  "溯洄咖啡",
        "address":  "招商街道海上世界广场船前广场第3-1-027号商铺MINIMAL(近消防站)（海上世界地铁站A口步行90米）",
        "dishes":  "1. 开心果巴斯克（流心质地，甜度不高，佐咖啡好物）；2. 各类手冲咖啡（喝完以后会知道办公室的咖啡机是大垃圾）。",
        "average":  "80",
        "rating":  "100",
        "note":  "最好的巴斯克 环境静谧，适合工作"
    },
    {
        "district":  "南山",
        "name":  "怪兽餐桌",
        "address":  "2号线东角头d口",
        "dishes":  "汉堡",
        "average":  "70",
        "rating":  "满分！",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "中山壹鸽",
        "address":  "碧桦路13号",
        "dishes":  "咖啡 花生拿铁（有点腻） 个人偏爱维也纳 甜品也好吃",
        "average":  "70",
        "rating":  "满分",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "U.TASTE",
        "address":  "南航公司公交车站",
        "dishes":  "印度特色黄油鸡配巴斯马蒂香米，水牛芝士球烤阿拉伯饼",
        "average":  "70",
        "rating":  "99",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "化州肥仔大排档（固戍店）",
        "address":  "桃园B口",
        "dishes":  "香油鸡，虾仁滑蛋，化州捞粉，",
        "average":  "60",
        "rating":  "90",
        "note":  "茂名化州人认可大排档，"
    },
    {
        "district":  "南山",
        "name":  "原味焗烤",
        "address":  "大新地铁站旁",
        "dishes":  "娃娃菜，油豆腐，方便面等",
        "average":  "50",
        "rating":  "满分",
        "note":  "7点开门，早点去"
    },
    {
        "district":  "南山",
        "name":  "Minimal Coffee x Bao",
        "address":  "广东省深圳市南山区同沙路20-6号",
        "dishes":  "黑影拿铁、红丝绒开心拿铁、招牌猪腩包、招牌薯条、鸡翅",
        "average":  "50",
        "rating":  "满分",
        "note":  "深圳难得有的黑芝麻咖啡，意大利恰巴塔做为汉堡胚的汉堡，很好吃"
    },
    {
        "district":  "南山",
        "name":  "猪一拉面",
        "address":  "南山学府路",
        "dishes":  "拉面不错",
        "average":  "50",
        "rating":  "90",
        "note":  "？不是预制菜"
    },
    {
        "district":  "南山",
        "name":  "黄牌鸡西刀削面",
        "address":  "西丽，广东省深圳市南山区西丽街道旺棠工业区22栋一楼32号6",
        "dishes":  "东北菜，锅包肉，辣汤刀削面",
        "average":  "50",
        "rating":  "90",
        "note":  "面条略贵但好吃"
    },
    {
        "district":  "南山",
        "name":  "tony k额不会了 （后来加的备注 我知道！是tony\u0027skitchen啦）",
        "address":  "水湾地铁站！",
        "dishes":  "披萨 巨好吃也便宜量大，适合聚餐",
        "average":  "50",
        "rating":  "99",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "一个锅（韩式料理）",
        "address":  "在后海地铁站D1出口步行300米不要上地铁 就在一楼",
        "dishes":  "鸡爪好吃 辛拉面不行 炸鸡要趁热吃但小心烫 部队锅最少三个人再点挺大一份的啥都有 饭团超推荐圆的那个里面有鱼籽忘记叫什么名字了 去晚了要排位 可以在饭点前一点时间过去就不用",
        "average":  "50",
        "rating":  "97",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "鸡翼山",
        "address":  "导航就有",
        "dishes":  "各种口味炸鸡翅、薯条小吃。还会有隐藏款鸡翅",
        "average":  "35",
        "rating":  "满分",
        "note":  "不好吃  纯属小红书美食  去一次不吃第二次  最多4分"
    },
    {
        "district":  "南山",
        "name":  "正宗重庆天福麻辣烫",
        "address":  "南山区荔芳一街光大村C栋阳光城",
        "dishes":  "麻辣烫啥都好吃",
        "average":  "30",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "春宇麻辣烫",
        "address":  "世界之窗地铁站",
        "dishes":  "湖南口味麻辣烫，东西煮很烂",
        "average":  "25",
        "rating":  "待补充",
        "note":  "大学城C口旁平山村也开了分店"
    },
    {
        "district":  "南山",
        "name":  "稻香肠粉皇",
        "address":  "花果山c2口",
        "dishes":  "我认为深圳最好吃的肠粉！！！",
        "average":  "20",
        "rating":  "100+",
        "note":  "你就只吃肠粉是吧"
    },
    {
        "district":  "南山",
        "name":  "嘉源砂锅麻辣烫",
        "address":  "南山区荔芳一街光大村C栋阳光城106号",
        "dishes":  "麻辣烫",
        "average":  "20",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "汤河粉(具体叫啥不太记得也搜不到)",
        "address":  "南山区南山街道鸿瑞花园南光路65-15号",
        "dishes":  "大骨汤粉，这家主要是他家的辣椒酱贼好吃，可以单买15一瓶；",
        "average":  "20",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "姊妹豆花",
        "address":  "南头古城东门对面义学街，美宜佳旁边",
        "dishes":  "芒果芋圆奶冻豆花、钵钵鸡",
        "average":  "20",
        "rating":  "100",
        "note":  "在深圳已经算是好吃的了"
    },
    {
        "district":  "南山",
        "name":  "国记正宗海南粉",
        "address":  "塘朗C口",
        "dishes":  "干腌猪肉，干腌牛肉，",
        "average":  "18",
        "rating":  "90",
        "note":  "清补凉也不错"
    },
    {
        "district":  "南山",
        "name":  "初茶·CHUCHAT",
        "address":  "西丽地铁站F口800米",
        "dishes":  "海盐冰茶",
        "average":  "15",
        "rating":  "99",
        "note":  "在广州曾经喝过就念念不忘，深圳终于有了，招牌的海盐冰茶真的超级好喝，是咸甜的，在别的奶茶店都没喝过这种味道"
    },
    {
        "district":  "南山",
        "name":  "Scnd火花螺蛳粉",
        "address":  "南头街1956里面，直接往里走就能看到了",
        "dishes":  "螺蛳粉汤饺绝绝子！我可太太太喜欢了，饺子是香菇肉馅的，配上螺蛳粉汤底真的很绝",
        "average":  "12",
        "rating":  "80",
        "note":  "其他菜品没试过，朋友说原味螺蛳粉一般般，但是螺蛳粉汤饺真的好吃！"
    },
    {
        "district":  "南山",
        "name":  "潮悦牛肉火锅店",
        "address":  "华侨城（连锁店）",
        "dishes":  "都不错",
        "average":  "待补充",
        "rating":  "132",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "记忆串城(壹号店)",
        "address":  "南油地铁站附近",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "100",
        "note":  "橘子推荐不好吃骂她"
    },
    {
        "district":  "南山",
        "name":  "森螺 螺蛳粉",
        "address":  "太子路83号",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "金汉亭海鲜烤肉（文光店）",
        "address":  "西丽旺棠",
        "dishes":  "肉类比较少，主打烤肥牛，酱好吃，烤土豆是招牌！",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "东城餐吧(旺棠店)",
        "address":  "西丽新围村",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "家里头潮汕味道(亿利达村店)",
        "address":  "学府路，南山医院旁边",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "心创优米",
        "address":  "粤海街道南油生活B区73南商路71-73栋108号",
        "dishes":  "糯米糍",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "那间小店",
        "address":  "南山地铁站E1口",
        "dishes":  "猪肚鸡、铁板涨蛋必吃！平价美食",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "国记海南粉",
        "address":  "大新地铁站",
        "dishes":  "清补凉 糟粕醋",
        "average":  "50",
        "rating":  "满分",
        "note":  "糟粕醋火锅要提前联系老板去买菜，都是新鲜的菜和海鲜，超好吃！"
    },
    {
        "district":  "南山",
        "name":  "老三样",
        "address":  "桃园",
        "dishes":  "鸡脚 红烧肉 捞粉好吃 基本都不踩雷 蔬菜都好吃",
        "average":  "50",
        "rating":  "99",
        "note":  "在深圳算遇到难得好吃平价的 湘赣等地区人福音 不能吃辣的话 别的菜也都不踩坑 一大桌人a下来四十几吃饱"
    },
    {
        "district":  "南山",
        "name":  "梅菜饼小摊",
        "address":  "深大丽湖夜市",
        "dishes":  "梅菜饼卷腌萝卜",
        "average":  "46244",
        "rating":  "满分",
        "note":  "刚烤出来的巨好吃，巨！好！吃！"
    },
    {
        "district":  "南山",
        "name":  "椰香情海南清补凉",
        "address":  "南头古城对面",
        "dishes":  "海南腌粉 清补凉",
        "average":  "20",
        "rating":  "满分",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "村西头猪脚饭",
        "address":  "桃园，南山医院后面",
        "dishes":  "猪脚饭",
        "average":  "20",
        "rating":  "满分",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "Below Sea Level Curry负海拔咖喱",
        "address":  "南山G口",
        "dishes":  "各种咖喱",
        "average":  "70",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "隅日本炸猪扒店",
        "address":  "",
        "dishes":  "厚切炸猪扒",
        "average":  "70",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "南山",
        "name":  "卤肉卷饼",
        "address":  "深大丽湖夜市",
        "dishes":  "招牌卤肉卷饼",
        "average":  "10",
        "rating":  "满分",
        "note":  "支持 一个就给我吃饱了"
    },
    {
        "district":  "龙岗",
        "name":  "惦记里烧烤大排档",
        "address":  "新桥西一巷19号",
        "dishes":  "铜炉火锅真的超香，但是只有天气冷的时候才有，烧烤也不错",
        "average":  "120",
        "rating":  "80",
        "note":  "现在变成烤肉店了，很伤心"
    },
    {
        "district":  "龙岗",
        "name":  "cant sleep cafe",
        "address":  "中心城新云路7号",
        "dishes":  "强推开心果巴斯克，口感超级细腻，咖啡推荐橘子海（不过是限定款的）",
        "average":  "50",
        "rating":  "90",
        "note":  "冲巴斯克我给90分"
    },
    {
        "district":  "龙岗",
        "name":  "小岛日式烤肉",
        "address":  "南联地铁站C1口出，摩尔城后面",
        "dishes":  "他们家的烤肉我都挺喜欢的，主食是面食为主，个人不爱吃面，服务员也都很贴心会帮忙烤",
        "average":  "120",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "白玉串城（有好几家分店）",
        "address":  "吉祥路紫薇花园中医馆旁边",
        "dishes":  "白玉串、猪肉包金针菇串、烤面包、烤玉米",
        "average":  "100",
        "rating":  "80",
        "note":  "最近出了68团100的券，可以去试试！"
    },
    {
        "district":  "龙岗",
        "name":  "老农民豆花饭",
        "address":  "爱联陂头背村三巷2号",
        "dishes":  "炒菜都很不错，蒜泥白肉，蒜苗回锅肉，肥肠",
        "average":  "30",
        "rating":  "80",
        "note":  "物美价廉好炫饭"
    },
    {
        "district":  "龙岗",
        "name":  "香酥鸡烧饼",
        "address":  "吉祥地铁站C出口直行100米再左拐200米",
        "dishes":  "待补充",
        "average":  "15",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "逍遥佟老八胡辣汤",
        "address":  "龙城广场B出口步行400米",
        "dishes":  "胡辣汤，煎包，豆腐脑",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "大话三城火锅万科店（以前叫张李记）",
        "address":  "吉祥C口，万科后面",
        "dishes":  "附近有三家大话三城只有万科这家好吃，店里随便点都好吃",
        "average":  "50-80",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "小团圆重庆老火锅",
        "address":  "坂田",
        "dishes":  "味正",
        "average":  "100",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "牛里牛气鲜牛肉自助",
        "address":  "横岗",
        "dishes":  "性价比超高",
        "average":  "100",
        "rating":  "95",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "辛三多家韩国料理",
        "address":  "横岗",
        "dishes":  "待补充",
        "average":  "90",
        "rating":  "90",
        "note":  "看火候，火候大烤出来是真的好吃"
    },
    {
        "district":  "龙岗",
        "name":  "尖尖牛牛杂",
        "address":  "平湖",
        "dishes":  "好吃不贵",
        "average":  "20",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "三鲜鱼粥",
        "address":  "华南城",
        "dishes":  "脆肉皖粥",
        "average":  "20",
        "rating":  "90",
        "note":  "很大一碗，运气好才能这小摊碰到这小摊"
    },
    {
        "district":  "龙岗",
        "name":  "马哥炒粉",
        "address":  "华南城",
        "dishes":  "炒米粉，炒田螺",
        "average":  "10-20",
        "rating":  "90",
        "note":  "炒田螺绝绝子"
    },
    {
        "district":  "龙岗",
        "name":  "喜士多",
        "address":  "华南城1号馆3楼",
        "dishes":  "鸭血粉丝豆腐套餐，牛筋丸",
        "average":  "7.5-15",
        "rating":  "90",
        "note":  "喜士多牛筋丸yyds"
    },
    {
        "district":  "龙岗",
        "name":  "盛平云权鸭粥",
        "address":  "龙平东路440-4号（公交到盛平天桥，地铁到南联C1口然后坐个摩的到盛平天桥）",
        "dishes":  "鸭煲鸡煲都好吃，可以点半只也可以点一只，一定要加一份香芋，真的好好吃！还有空心菜也很好吃，点煲会配",
        "average":  "40-50",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "LousFans螺蛳粉",
        "address":  "爱联社区田寮村爱联地铁站附近",
        "dishes":  "干净卫生，不重口，汤底很清甜不干口，喜欢清淡点的试试他家，加炸蛋很配",
        "average":  "20-35",
        "rating":  "90",
        "note":  "工作日有团购"
    },
    {
        "district":  "龙岗",
        "name":  "鸡蛋汉堡",
        "address":  "坂田北A口摆摊",
        "dishes":  "超级无敌好吃，但我忘记价格了",
        "average":  "3",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "张氏父子肥肠",
        "address":  "坂田店",
        "dishes":  "套餐有：酸菜肥肠+炒胡萝卜+炒绿叶绿叶菜",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "茂林烤鸡",
        "address":  "华为地铁站客家皇子那条路",
        "dishes":  "没有室内环境，就大排档，烤鸡和炒蟹好吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "禾木烧烤",
        "address":  "龙岗区横岗地铁站c口一路往里走",
        "dishes":  "蒜香烤鱼 美团六十多拿下 烧烤闭着眼睛点",
        "average":  "70-100",
        "rating":  "90",
        "note":  "炭烤 人不多 建议两人以上去 可以吃多些"
    },
    {
        "district":  "龙岗",
        "name":  "真螺味螺蛳粉",
        "address":  "南联地铁站B口",
        "dishes":  "它家螺蛳粉就是坠好次的！",
        "average":  "15-20",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "鸿记牛肉店",
        "address":  "地图搜索南联店或者欧景城店都可以",
        "dishes":  "牛肉粿条汤",
        "average":  "20内",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "海安安",
        "address":  "丹竹头地铁站恋珠东",
        "dishes":  "生熟牛肉汤粉 炸春卷 啊啊啊啊 巨好吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "吴庄",
        "address":  "龙城广场地铁站附近，在万科里二楼",
        "dishes":  "酸菜鱼我狂推啊啊啊啊啊！",
        "average":  "丰俭由人，但一般不超过60",
        "rating":  "90",
        "note":  "我跟朋友去了无数次，吃了四五年才吃腻，真的很爱它😭"
    },
    {
        "district":  "龙岗",
        "name":  "路边烧烤摊",
        "address":  "坂田五和H出口，那条街上。摆摊，有露天的桌椅坐，摊位对面有便利店可以去买酒。",
        "dishes":  "晚上几点开始不清楚，两三点肯定有。超级好吃！！！烤串，各种烤串。空心菜绝了。一个人能炫十串。",
        "average":  "女生吃得少人均30感觉饱了。吃多吃少看你自己了，点多少花多少。",
        "rating":  "90",
        "note":  "晚上去吃合适，多穿件外套。喝酒聊天露天有点冷。"
    },
    {
        "district":  "龙岗",
        "name":  "忠记炒粉",
        "address":  "南联地铁站 罗瑞合美食街进去定位苏记牛杂 门口摆摊的夫妻档",
        "dishes":  "炒米粉炒河粉都很好吃很有锅气！河粉应该是粿条炒的 他家还有炒钉螺花甲啥的",
        "average":  "11",
        "rating":  "90",
        "note":  "晚上八点后才出摊"
    },
    {
        "district":  "龙岗",
        "name":  "小团圆重庆老火锅",
        "address":  "坂田街道冲之大道黄金山综合楼北侧临街商铺第21号",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "阮三孃",
        "address":  "坂田那边 雪象F口",
        "dishes":  "火锅",
        "average":  "80-100",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "一碗鲜杀猪粉",
        "address":  "平湖华南城",
        "dishes":  "杀猪粉",
        "average":  "10～20",
        "rating":  "90",
        "note":  "可以免费无限续粉，很多料，美团大众点评抖音购买更划算；这个非常一般"
    },
    {
        "district":  "龙岗",
        "name":  "星店",
        "address":  "平湖街道凤凰大道239-1号",
        "dishes":  "都推荐，份量大又实惠，口味也好，主打的就是一个性价比",
        "average":  "待补充",
        "rating":  "95",
        "note":  "人很多，饭店要等位，建议提早去；现在融湖广场也开了一家分店，不用排队了，两家店离的不是很远"
    },
    {
        "district":  "龙岗",
        "name":  "西安肉夹馍",
        "address":  "罗瑞合美食街夜市",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "hicoffee精品咖啡",
        "address":  "学府道花园楼下",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "周记螺狮粉",
        "address":  "五和长发西路12号",
        "dishes":  "价格优惠量适中，柳州味",
        "average":  "11元-20元",
        "rating":  "90",
        "note":  "排队王，早点去"
    },
    {
        "district":  "龙岗",
        "name":  "七友美蛙鱼头火锅",
        "address":  "五和地铁A出口150米",
        "dishes":  "老重庆的味道，锅底越煮越香，适合重口味的，老豆腐入味后超好吃！！！",
        "average":  "80",
        "rating":  "90",
        "note":  "七点后大概率需要排队；味道一般般说实话"
    },
    {
        "district":  "龙岗",
        "name":  "博姐烫菜工厂",
        "address":  "四联E2出口",
        "dishes":  "麻酱干拌特别好吃，老板人也很好",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "炭烤新鲜五花肉",
        "address":  "南联罗瑞合美食街，常摆摊位在中间铁架下面，烟最大的那家烧烤就是",
        "dishes":  "10元一份4串五花肉和新鲜九节虾，新鲜牛肉跟牛胸口油，5元一串烤大鸡爪，不时有新品加入，现烤的超好吃！！",
        "average":  "20",
        "rating":  "90",
        "note":  "老板只卖新鲜的，不卖冻品。因为是兼职烧烤，就周三周五周六周日营业，营业前会在粉丝群通知。"
    },
    {
        "district":  "龙岗",
        "name":  "不晚柠檬茶",
        "address":  "南联罗瑞合美食街，中间部分，城市快药药店门口摆着",
        "dishes":  "8-15之间的茶类，可加料，在罗瑞合里这么多饮品类摊位很好喝的",
        "average":  "12",
        "rating":  "80",
        "note":  "夜宵时间人比较多，可外卖送上门"
    },
    {
        "district":  "龙岗",
        "name":  "郑可以",
        "address":  "愉园地铁站",
        "dishes":  "火锅 好吃很便宜",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "贵阳喜樂烧烤",
        "address":  "坂田北A口 吉华路583号",
        "dishes":  "烧烤，好吃又便宜，烤豆皮很好吃，",
        "average":  "一般不超过50",
        "rating":  "95",
        "note":  "不过都是碳烤 稍微有点慢，可以接受，周末人多可能需要排队"
    },
    {
        "district":  "龙岗",
        "name":  "品味轩乳鸽王海鲜渔港",
        "address":  "华南城南门1号路",
        "dishes":  "海鲜粥，乳鸽必点",
        "average":  "300（2-4个人吃）",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "潮顺牛肉汤粉店",
        "address":  "凤凰社区顺昌街33号101",
        "dishes":  "牛肉很新鲜，没有不好吃的",
        "average":  "30",
        "rating":  "100",
        "note":  "不要点外卖，必须到店吃，外卖吃的跟到店味道不一样。隔壁也是他家的牛肉火锅店，量大好吃，需早点去饭点很多人"
    },
    {
        "district":  "龙岗",
        "name":  "烧烤 烤鸡",
        "address":  "龙城广场B出口步行600米鹏达向银路口公交站（卓越图文隔壁）烧黑的招牌",
        "dishes":  "烤鸡超级香，68/只，纯柴火现烤，店名都烧黑了，你就说香不香吧",
        "average":  "50",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "柳州螺蛳粉",
        "address":  "南约/宝龙地铁站附近，联合市场停车场摆摊螺蛳粉",
        "dishes":  "鸭脚螺蛳粉，配菜自助：ong菜梗、酸萝卜、泡彩椒、折耳根、紫苏",
        "average":  "10元起",
        "rating":  "95",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "拾肆泰·東南亚風味(坂田店)",
        "address":  "马安堂社区布龙路595号德润荣君府4B栋GN14半地下1N14商铺",
        "dishes":  "超便宜，推荐冬阴功汤跟马拉盏通菜，炸鸡排也可以",
        "average":  "50左右",
        "rating":  "85",
        "note":  "店有点小，下班时间过去大概率要排队，有时候上餐会比较慢"
    },
    {
        "district":  "龙岗",
        "name":  "专业炒粉（移动摊位）",
        "address":  "坂田五和H口出来 走到和磡那个路口 挂灯的大树旁边",
        "dishes":  "炒河粉超级无敌好吃 锅气超级足！！还有炒方便面、炒粉、炒饭都好吃",
        "average":  "10/份",
        "rating":  "90",
        "note":  "6点半左右出摊 8点左右在蜜雪冰城前面摆摊"
    },
    {
        "district":  "龙岗",
        "name":  "广聚和螺蛳粉店（平湖店）",
        "address":  "龙岗区平湖街道凤凰社区荔园街51号-地铁10号线双拥姐站A扣步行230m",
        "dishes":  "老板广西带来的配方，好吃，胃口好加猪蹄，腊肠美滋滋。旁边有蜜雪冰城，来杯柠檬水更佳。",
        "average":  "11-30元",
        "rating":  "100",
        "note":  "吃了100碗+了，但是口味飘忽不定，有时候会不好吃，一定要加紫苏"
    },
    {
        "district":  "龙岗",
        "name":  "GE BAKE",
        "address":  "愉园站C口 仁恒梦中心L1",
        "dishes":  "低脂吞拿鱼全餐",
        "average":  "待补充",
        "rating":  "95",
        "note":  "不是所有菜都好吃，但这道菜好吃"
    },
    {
        "district":  "龙岗",
        "name":  "夏两串 益阳麻辣烫",
        "address":  "民治D口直走几百米左转 按导航走",
        "dishes":  "超级好吃 够辣够入味 豆腐串好吃 很多菜品都很好吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "二妹螺蛳粉",
        "address":  "",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "潮汇源潮汕菜（布吉店）",
        "address":  "布吉地铁站往去高铁站方向出口出去，忘了是叫哪个口了",
        "dishes":  "潮汕菜、海鲜都很nice",
        "average":  "100",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "华记美大排档(布吉店)",
        "address":  "布吉地铁站往去高铁站方向出口出去，忘了是叫哪个口了",
        "dishes":  "生腌好吃，新鲜，就在上面的潮汇源潮汕菜附近",
        "average":  "80",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "烤鸡营地(四联路店)",
        "address":  "横岗地铁站D口出来，详细地址：广东省深圳市龙岗区横岗街道横岗社区四联路52号103室",
        "dishes":  "强推烤鸡，49.9一只现烤，要等20-30分钟左右，可以提前打电话预约：15118844880。坐二楼，氛围很好。有烧烤，烧烤味道一般",
        "average":  "40",
        "rating":  "90",
        "note":  "烤鸡很绝，烧烤再好吃点就完美了"
    },
    {
        "district":  "龙岗",
        "name":  "谭谭果酱烧烤",
        "address":  "南坑地铁站星光之约南门",
        "dishes":  "很有特色，水果烧烤，但是排队较久",
        "average":  "50+",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "螺欢喜螺蛳粉火锅",
        "address":  "吉祥地铁站C口",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "候嘿正越式牛肉粉",
        "address":  "南联地铁站A2",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙岗",
        "name":  "榕边干蒸鲜排骨",
        "address":  "深圳市龙岗区坂田街道光雅园路北1巷1号102",
        "dishes":  "捞粉、蒸排骨、蒸鸡",
        "average":  "50+",
        "rating":  "80",
        "note":  "大部分都蛮好吃"
    },
    {
        "district":  "龙华",
        "name":  "锦江之星猪脚饭",
        "address":  "龙华时光台球俱乐部门口，摆在民兴路口公交站",
        "dishes":  "猪脚拼烧鸭，排骨饭",
        "average":  "15",
        "rating":  "95",
        "note":  "深圳吃过的猪脚饭天花板，15块双拼无敌，一辆深夜11点才摆出来的面包车，老板很讲究卫生，带口罩，准备了给客人自己洗手用的水。是外卖小哥，出租车司机，代驾师傅夜里饱餐一顿的温暖加油站"
    },
    {
        "district":  "龙华",
        "name":  "湖南牛杂小摊",
        "address":  "龙华宝能科技园和台菱大厦中间的红绿灯路口附近，一般在那里",
        "dishes":  "牛杂、牛腩",
        "average":  "20",
        "rating":  "满分！",
        "note":  "特别好吃，有辣的和不辣的，建议吃辣的更好吃，秒杀百分之99的其他牛杂店和摊子，；联系不上老板可以打电话问在哪13556889971"
    },
    {
        "district":  "龙华",
        "name":  "陕南人家面馆",
        "address":  "世纪春城民治民福北路",
        "dishes":  "面条 肉夹馍",
        "average":  "20",
        "rating":  "8",
        "note":  "龙华最好吃的面馆"
    },
    {
        "district":  "龙华",
        "name":  "大吃螺螺蛳粉",
        "address":  "元芬地铁站，导航步行10分钟",
        "dishes":  "招牌螺蛳粉加炸蛋",
        "average":  "20",
        "rating":  "9",
        "note":  "周围所有螺蛳粉店里最好吃的一家！！！！还有美团代金券可以买"
    },
    {
        "district":  "龙华",
        "name":  "老顾客煲仔饭",
        "address":  "红山地铁站A口",
        "dishes":  "自选四个菜，辣椒酱很香，饭点需要排队，美团用券便宜",
        "average":  "20",
        "rating":  "90",
        "note":  "好吃！"
    },
    {
        "district":  "龙华",
        "name":  "十里鸡公煲",
        "address":  "龙华区民治街道塘水围村",
        "dishes":  "好吃好吃",
        "average":  "25",
        "rating":  "8",
        "note":  "只有塘水围村的好吃！！；加一；龙华大浪的味道还行，肉不是很新鲜"
    },
    {
        "district":  "龙华",
        "name":  "肥肥油炸民治店",
        "address":  "民治地铁站D出口再步行500米，民治街道民强社区东边老村4栋102",
        "dishes":  "年糕，土豆片，里脊，淀粉肠，鸡柳，藕片，记得要点“要干要脆”",
        "average":  "25",
        "rating":  "满分",
        "note":  "可以点外卖；想吃垃圾食品了可点；微辣就可以；因为辣椒粉不辣只咸，中辣会提升咸度，太重口了"
    },
    {
        "district":  "龙华",
        "name":  "民乐市场对面的无名麻辣烫",
        "address":  "位于民乐市场正门对面的小巷",
        "dishes":  "牛肚，牛肠，牛筋，鸡脚，生面",
        "average":  "30",
        "rating":  "90",
        "note":  "晚上10点开到凌晨4点的麻辣烫店当地居民深夜围炉一般坐在炉子面前夹菜，有点类似铁板烧一样看着老板娘操作，老板娘烫的面弹性刚好，汤底整体偏咸适合下酒，最强的地方就是将老板自制的辣酱加剁椒加番茄酱混在一起蘸肉吃是最爽！"
    },
    {
        "district":  "龙华",
        "name":  "瑯西巷子·南宁老友粉",
        "address":  "红山地铁站B口",
        "dishes":  "老友牛肉粉（干捞和汤粉都好吃）、蒜香排骨、紫苏豆腐、鸡翅",
        "average":  "40",
        "rating":  "满分",
        "note":  "非常旺的一个小店，需要现场取号排队，工作日晚上和周末人都很多，要等比较久。"
    },
    {
        "district":  "龙华",
        "name":  "西岐一碗香",
        "address":  "龙华地铁站C口下楼到十字路口右转150米",
        "dishes":  "正宗陕西面，面都是老板从陕西空运来的",
        "average":  "40",
        "rating":  "90",
        "note":  "不建议外卖，面会坨"
    },
    {
        "district":  "龙华",
        "name":  "锦记鸡煲王",
        "address":  "民治地铁a口步行200米",
        "dishes":  "推荐鸡煲，賊几把好吃",
        "average":  "44",
        "rating":  "满分",
        "note":  "美团88套餐吃到撑；老板娘非常漂亮"
    },
    {
        "district":  "龙华",
        "name":  "湘邻乡味",
        "address":  "4号线白石龙地铁站A口鑫海公寓楼下",
        "dishes":  "68元双人套餐红烧鲤鱼好吃得要死",
        "average":  "50",
        "rating":  "满分！",
        "note":  "美团68元双人套餐两荤一素分量十足滋味也好！"
    },
    {
        "district":  "龙华",
        "name":  "吴川炖品",
        "address":  "白石龙幼儿园附近，对面是消防站，旁边有一家吴川快餐",
        "dishes":  "白切鸡+各类粤西汤",
        "average":  "50",
        "rating":  "8",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "齐齐哈尔家常烤肉",
        "address":  "龙华区美丽365花园4号门旁（近清湖地铁站c出口）",
        "dishes":  "五花肉 酸菜 哈尔滨红肠All",
        "average":  "60",
        "rating":  "7",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "小会哈尔滨烧烤",
        "address":  "龙华区和平路252号（龙华地铁站B口步行330米）",
        "dishes":  "各种肉串、炒泡面",
        "average":  "60",
        "rating":  "95",
        "note":  "东北烧烤，又大又香又好吃！"
    },
    {
        "district":  "龙华",
        "name":  "虾念",
        "address":  "龙华和平路248号",
        "dishes":  "虾兵蟹将、卤武昌鱼",
        "average":  "70",
        "rating":  "满分！",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "重庆绝味美蛙鱼头",
        "address":  "大浪街道华旺路166号",
        "dishes":  "蛙鱼头火锅 肉质都很鲜嫩巨好吃",
        "average":  "70",
        "rating":  "满分",
        "note":  "老板服务员都是重庆人，妥妥重庆口味，喜欢的冲；味道一般，店里卫生不行，服务员在店内抽烟"
    },
    {
        "district":  "龙华",
        "name":  "兴泰兄弟大排档",
        "address":  "白石龙老区美宜佳附近，隔壁是一家桥下烧烤",
        "dishes":  "砂锅粥好吃。铁板鱼泡好吃",
        "average":  "70",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "深夜烧烤",
        "address":  "",
        "dishes":  "好吃的",
        "average":  "70",
        "rating":  "待补充",
        "note":  "烧烤GOAT"
    },
    {
        "district":  "龙华",
        "name":  "重庆印象老火锅",
        "address":  "红山地铁站D1出口再步行650米，龙华区民塘路南源新村25-1",
        "dishes":  "鸭血，酥肉，卤鸡爪，炒饭，怒火冰汤圆，厚土豆片每次都点，肉随自己喜欢点，都好吃",
        "average":  "70",
        "rating":  "满分",
        "note":  "福田店排队的人超多，民治这家还好，基本不用等位；\n微辣就好，中辣真的会很辣，湖南湖北人认证的那种辣。；店的环境一般般，搞的破旧风装修，但不影响好吃"
    },
    {
        "district":  "龙华",
        "name":  "我是面包",
        "address":  "红山地铁站D1出口再步行500米，龙华区红木街莱蒙水榭春天5期2-2",
        "dishes":  "谷饲牛肉杂菌沙拉，黑椒牛柳/芝士番茄/黑松露奶油培根意面都好吃，甘梅粉红薯条，羽衣甘蓝青苹果，椰子水系列都好喝！甜点推荐原味的巴斯克，面包有很多种基本不踩雷",
        "average":  "70",
        "rating":  "满分",
        "note":  "环境好，适合吃漂亮饭，喝咖啡，下午茶；可以点外卖"
    },
    {
        "district":  "龙华",
        "name":  "成都鱼庄",
        "address":  "春华四季园10栋78号商铺",
        "dishes":  "牛蛙、耗儿鱼",
        "average":  "80",
        "rating":  "满分",
        "note":  "牛蛙！！一人两斤，炫就完了"
    },
    {
        "district":  "龙华",
        "name":  "卡朋西餐",
        "address":  "龙华壹方天地",
        "dishes":  "牛排/焗饭很多菜都好吃",
        "average":  "80",
        "rating":  "满分",
        "note":  "性价比超值的西餐！很好吃！；寿喜锅避雷哈"
    },
    {
        "district":  "龙华",
        "name":  "撸起袖子吧烧烤",
        "address":  "清湖/连锁店各区都有美团搜",
        "dishes":  "牛蛙/烧烤都好吃",
        "average":  "90",
        "rating":  "满分",
        "note":  "便辣偏重口的快冲！"
    },
    {
        "district":  "龙华",
        "name":  "露两手顺德菜（龙华店",
        "address":  "龙华站D出口",
        "dishes":  "一鱼三吃，腐竹皮",
        "average":  "100",
        "rating":  "满分",
        "note":  "不能线上拿号，只能去现场等"
    },
    {
        "district":  "龙华",
        "name":  "文记虾一跳（深圳北店）",
        "address":  "白石龙地铁A出口再步行500米",
        "dishes":  "长沙口味虾（天宝兄弟替代品），虾蟹一锅鲜，臭豆腐，烧烤也还不错",
        "average":  "140",
        "rating":  "95",
        "note":  "可以点外卖"
    },
    {
        "district":  "龙华",
        "name":  "肥肥虾庄龙华店",
        "address":  "龙华地铁站C出口步行500米的样子",
        "dishes":  "凉拌毛豆，凉面，虾，香辣蟹（等河蟹肥的时候再点，十月中下旬）",
        "average":  "140",
        "rating":  "95",
        "note":  "可以点外卖"
    },
    {
        "district":  "龙华",
        "name":  "宇德隆记客家食府（龙华店）",
        "address":  "龙华大道共和商业广场1-3楼（距离山姆500多米",
        "dishes":  "水晶鸡好吃，鸡肉很嫩，多汁",
        "average":  "100+",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "丁记烩面",
        "address":  "龙华地铁站出来几百米",
        "dishes":  "必点大盘鸡，特别特别香，胡辣汤很大一碗，洛馍卷羊肉也好评",
        "average":  "100内",
        "rating":  "满分！",
        "note":  "龙华丁记烩面的大盘鸡是深圳所有丁记烩面店最好吃的，河南人认证"
    },
    {
        "district":  "龙华",
        "name":  "『打包快乐』福鼎肉片",
        "address":  "龙华区民治街道白石龙一区微棠A103栋美宜佳旁，近白石龙地铁b口，走路6分钟左右",
        "dishes":  "福建特色小吃福鼎肉片，酸酸辣辣很开胃；店里还有饭团，料很足，老板有时也自制熬煮仙草冻或者研发新品，靠近的朋友们快来尝尝。离开福建很久真的就好一口酸酸辣辣的福鼎肉片。",
        "average":  "10至20",
        "rating":  "满分",
        "note":  "店里只有老板一个人，所以有时候很忙速度会慢一些"
    },
    {
        "district":  "龙华",
        "name":  "帅帅湖北大排档",
        "address":  "白石龙地铁A出口再步行350米，龙华区梅龙大道153号鑫海公寓1层",
        "dishes":  "红烧鲫鱼（长在长江边的人会懂在深圳吃到鲜甜没土腥味的鲫鱼的含金量），公安夹竹园火腿（是一种豆制品，方言叫火腿，跟香干有点像，嫩嫩的），藕汤（冬天喝），红菜苔（湖北特色蔬菜），鸡蛋炒湖北豆皮子（绿豆制品，这个要看能不能吃惯）。",
        "average":  "40-90",
        "rating":  "满分",
        "note":  "可以点外卖"
    },
    {
        "district":  "龙华",
        "name":  "山分田浏阳下饭菜",
        "address":  "民治地铁站A出口再步行500米，民治街道樟坑社区民康路东明大厦108",
        "dishes":  "老姜鲜炒土鸡，金钱蛋（比深圳的笨萝卜好吃），浏阳醋蒸鸡",
        "average":  "40-90",
        "rating":  "满分",
        "note":  "可以点外卖"
    },
    {
        "district":  "龙华",
        "name":  "牛王庙",
        "address":  "龙华区振翔路17号",
        "dishes":  "蹄花yyds！蒜泥白肉可以可以",
        "average":  "60-70",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "韩国炸酱面·石锅拌饭(清湖店)",
        "address":  "富泉新村富泉路24-12惠乐美食街（圣博雅商务中心），四号线清湖c1下来，导航过去",
        "dishes":  "韩式炸酱面",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "悟能八戒烤肉",
        "address":  "红山地铁站6979",
        "dishes":  "套餐",
        "average":  "待补充",
        "rating":  "95",
        "note":  "好吃，同伴烤你吃最好吃了"
    },
    {
        "district":  "龙华",
        "name":  "小团圆重庆火锅",
        "address":  "坂田/杨美 美团搜一下",
        "dishes":  "都好吃 辣死 建议点九宫格",
        "average":  "待补充",
        "rating":  "满分",
        "note":  "能吃辣就去"
    },
    {
        "district":  "龙华",
        "name":  "莲香西域",
        "address":  "龙华地铁站哪口忘了 有麦当劳那个 大信花园店",
        "dishes":  "大盘鸡 牛肉水饺 烧烤 自制酸奶都好吃",
        "average":  "待补充",
        "rating":  "满分",
        "note":  "新疆菜烧烤都好吃！铜火锅没试过；西丽那家感觉更好吃"
    },
    {
        "district":  "龙华",
        "name":  "馒小哥",
        "address":  "龙华地铁站a口",
        "dishes":  "红糖馒头真的很多料",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "田伯伯长沙米粉",
        "address":  "花园新村3栋503",
        "dishes":  "半只鸡粉",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "民治大润发对面那家报吃；对我也觉得大润发的难吃"
    },
    {
        "district":  "龙华",
        "name":  "大娘湘厨",
        "address":  "科源商务大厦店 导航一下",
        "dishes":  "好吃好吃",
        "average":  "待补充",
        "rating":  "满分",
        "note":  "同事一致好评的湘菜"
    },
    {
        "district":  "龙华",
        "name":  "云端小院.湘菜.烧鸡.烧烤",
        "address":  "五和社区九区二巷（坂田a）",
        "dishes":  "烧烤好吃 离地铁站有段距离，菜也不错 不要点鸡，有鸡味 其他都不错",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "龙华",
        "name":  "妙屋吃茶店-下午茶",
        "address":  "龙华地铁站附近，集瑞二区",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "哥老官美蛙鱼头",
        "address":  "华强北",
        "dishes":  "待补充",
        "average":  "100",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "壮乡全聚福 • 广西米粉（罗\n湖店)",
        "address":  "罗湖区展艺路艺览中心C106（红岭北D口）",
        "dishes":  "老友粉、炸鸭脚",
        "average":  "50",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "峰景台牛杂",
        "address":  "罗湖区峰景台（怡景B口）",
        "dishes":  "都不错，推加蒜酱，口味偏淡",
        "average":  "20",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "新发茶餐厅",
        "address":  "黄贝岭F1口/大剧院E口",
        "dishes":  "烧腊YYDS焗饭也是我的爱",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "森some fusion",
        "address":  "人民南C口直走",
        "dishes":  "牛排和炸鸡脆骨都好吃！",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "鸡煲之家",
        "address":  "向西村里面靠近木屋烧烤",
        "dishes":  "鸡煲",
        "average":  "60",
        "rating":  "100",
        "note":  "深圳人从小吃到大"
    },
    {
        "district":  "罗湖",
        "name":  "花臂炭火泥炉烤肉",
        "address":  "老街站G出口往超级文和友那边去然后导航去柏瑾酒店的路上",
        "dishes":  "和牛，护心肉，牛舌，大白梨，大菠萝",
        "average":  "100+",
        "rating":  "98",
        "note":  "超好吃老板东北银讲话很有意思"
    },
    {
        "district":  "罗湖",
        "name":  "新发烧腊茶餐厅",
        "address":  "黄贝岭 向西村 金光华广场都有分店",
        "dishes":  "都好吃  我觉得咖喱特别好吃！强推！",
        "average":  "60",
        "rating":  "95",
        "note":  "深圳最好吃的茶餐厅"
    },
    {
        "district":  "罗湖",
        "name":  "豪先生（JuenHo)",
        "address":  "红岭站E出口",
        "dishes":  "魔鬼费列罗，海盐焦糖戚风",
        "average":  "60",
        "rating":  "90",
        "note":  "蛋糕都很好吃，咖啡一般"
    },
    {
        "district":  "罗湖",
        "name":  "香港才记牛什粉面店",
        "address":  "笋岗站C2出口笋岗派出所对面",
        "dishes":  "牛杂牛杂牛杂",
        "average":  "20",
        "rating":  "95",
        "note":  "环境简陋，东西好吃"
    },
    {
        "district":  "罗湖",
        "name":  "新起点脆肉鲩火锅",
        "address":  "9号线园岭站C口",
        "dishes":  "乳鸽、脆肉鲩火锅",
        "average":  "75",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "红八方柴火铁锅炖(东园路店)",
        "address":  "东园路滨江新村52栋105G",
        "dishes":  "铁锅炖",
        "average":  "70",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "急急脚咖啡",
        "address":  "东园路滨江新村52栋105G",
        "dishes":  "爆米花拿铁",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "许老二海鲜烧烤",
        "address":  "新秀站",
        "dishes":  "烤脆鳗 鳗鱼 生蚝",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "卓记米粉",
        "address":  "大剧院站出门导航",
        "dishes":  "鸡肉炒米粉、羊肉手抓饭",
        "average":  "30",
        "rating":  "95",
        "note":  "很大碗很正宗，建议微辣"
    },
    {
        "district":  "罗湖",
        "name":  "水库新村对面麻辣烫",
        "address":  "水库新村对面巷子里的摊子",
        "dishes":  "水煮麻辣烫",
        "average":  "20",
        "rating":  "90",
        "note":  "很好吃，辣椒很辣"
    },
    {
        "district":  "罗湖",
        "name":  "太兴茶餐厅",
        "address":  "金光华广场-1",
        "dishes":  "三杯鸡、粉丝虾煲",
        "average":  "60",
        "rating":  "85",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "小东北砂锅居",
        "address":  "湖贝地铁站D口180米",
        "dishes":  "必点坛肉、油饼和油豆角土豆排骨锅",
        "average":  "30到40",
        "rating":  "95+",
        "note":  "坛肉肥而不腻，份量都足，老板人好"
    },
    {
        "district":  "罗湖",
        "name":  "山禾田·创作料理",
        "address":  "国贸地铁站b口",
        "dishes":  "金枪鱼拌饭+鳗鱼玉子烧（还有泡菜寿喜锅）",
        "average":  "100",
        "rating":  "90",
        "note":  "换了新店面，拍照好看多了"
    },
    {
        "district":  "罗湖",
        "name":  "大阪日本料理店",
        "address":  "国贸地铁站E口",
        "dishes":  "大阪榴莲卷yyds啊，烧肉拼盘也很有味",
        "average":  "200+",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "李师傅脆肚",
        "address":  "向西村a口",
        "dishes":  "除了招牌脆肚以外，炒粉一绝",
        "average":  "100+",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "龟老吉",
        "address":  "黄贝岭b口500米",
        "dishes":  "招牌芋圆椰汁仙草一定要点，清爽类的马蹄芦荟也很好喝",
        "average":  "20",
        "rating":  "95",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "燚年华",
        "address":  "向西村A口过马路200米",
        "dishes":  "烤肉一定要点招牌的，牛肉最好吃，冷面和凉粉也超级不错",
        "average":  "120+",
        "rating":  "93",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "小罗臭豆腐",
        "address":  "老街地铁站文和友一楼",
        "dishes":  "臭豆腐",
        "average":  "待补充",
        "rating":  "95",
        "note":  "周末人比较多，分量足，味道比较正宗，酸萝卜配菜好"
    },
    {
        "district":  "罗湖",
        "name":  "七の居酒屋",
        "address":  "宝安南路",
        "dishes":  "土豆泥，三文鱼，美团双人套餐",
        "average":  "20",
        "rating":  "98",
        "note":  "装修很有日式风格，拍照好看。里面的食材也比较新鲜，关键是好吃，完全能吃饱！"
    },
    {
        "district":  "罗湖",
        "name":  "蘩楼",
        "address":  "",
        "dishes":  "红米肠，芋头糕，艇仔粥，榴莲酥",
        "average":  "70+",
        "rating":  "100",
        "note":  "早茶好去处！味道很鲜美而且上菜快，好像是深圳排名第一的早茶店"
    },
    {
        "district":  "罗湖",
        "name":  "twenty percent",
        "address":  "大剧院c出口，地王大厦正对面",
        "dishes":  "千层蛋糕，伯爵茶瑞士卷，水果塔",
        "average":  "30",
        "rating":  "95",
        "note":  "宝藏小众甜品店，法式风格装修，甜品每天不同，要去碰运气"
    },
    {
        "district":  "罗湖",
        "name":  "紫霞门",
        "address":  "湖贝路A",
        "dishes":  "海鲜豆腐汤，蔬菜饼等，创新料理没有传统料理好吃",
        "average":  "100",
        "rating":  "80",
        "note":  "老字号韩料店；性价比高"
    },
    {
        "district":  "罗湖",
        "name":  "美极鲜",
        "address":  "鹏威酒店二楼，近大剧院地铁站、振业大厦公交站，",
        "dishes":  "招牌鸭五件",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "老牌韶关菜，招牌鸭五件好吃，唯一缺点上菜略慢"
    },
    {
        "district":  "罗湖",
        "name":  "水贝细池酥面馆",
        "address":  "水贝珠宝附近一个老小区，点评排名也是靠前，直接大众导航",
        "dishes":  "潮汕汤面",
        "average":  "20",
        "rating":  "80",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "肥妹烧腊",
        "address":  "翠竹地铁口，",
        "dishes":  "烧鹅！",
        "average":  "70",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "探湘",
        "address":  "红岭H口",
        "dishes":  "各种小炒都好吃 基本可以盲点 花卷很香  湖南菜微辣也很辣 吃不了辣一定要跟老板强调一下",
        "average":  "70",
        "rating":  "85",
        "note":  "暂无备注"
    },
    {
        "district":  "罗湖",
        "name":  "卓记米粉 新疆店",
        "address":  "大剧院D出口",
        "dishes":  "手抓饭 跟 新疆炒米粉都挺好吃的 米粉微辣也有点辣",
        "average":  "30➕",
        "rating":  "85",
        "note":  "有点辣！晚高峰有时候要排队"
    },
    {
        "district":  "罗湖",
        "name":  "SOYFOOD韩国小吃",
        "address":  "老街C出口附件",
        "dishes":  "推荐拌饭、泡菜饼都好好吃",
        "average":  "40",
        "rating":  "80",
        "note":  "店面很小，可以避开饭点或者工作日去，开了快十年了，老板是韩国人，好吃"
    },
    {
        "district":  "福田",
        "name":  "沪上阿姨",
        "address":  "任意门店",
        "dishes":  "绿豆牛乳冰",
        "average":  "19",
        "rating":  "90",
        "note":  "喝过最喜欢的牛乳冰！美团可以买券 到店买才10块左右！！；+1票"
    },
    {
        "district":  "福田",
        "name":  "椿风",
        "address":  "华新A2口出来往南走，港澳城国美那条巷子里",
        "dishes":  "煎饼果子，老豆腐，浆子，嘎巴菜，羊汤",
        "average":  "30",
        "rating":  "天津人在深的福音",
        "note":  "正宗天津早点"
    },
    {
        "district":  "福田",
        "name":  "二姐夫煎饼果子",
        "address":  "华强北 华发南路下步庙北区22栋1楼",
        "dishes":  "好吃  好吃 酒也贼好喝",
        "average":  "30",
        "rating":  "500",
        "note":  "炫就完了"
    },
    {
        "district":  "福田",
        "name":  "华师傅过桥米线",
        "address":  "上梅林 医院附近 地图一下",
        "dishes":  "都好吃 真的好吃 捞粉肠！绿豆沙！咖喱鱼蛋\n！瑶柱粥！",
        "average":  "30",
        "rating":  "待补充",
        "note":  "真的难吃，感觉粥里的料都是冰冻很久的"
    },
    {
        "district":  "福田",
        "name":  "冰村大叔",
        "address":  "kkone对面东涌路下沙村一坊13号1楼",
        "dishes":  "指天椒炒牛肉 , 咖喱猪扒饭 , 滑蛋牛肉饭 , 洋葱猪扒饭",
        "average":  "50",
        "rating":  "85",
        "note":  "店面比较破，但味道很好，中午是附近打工人的饭堂"
    },
    {
        "district":  "福田",
        "name":  "好好滋味茶餐厅",
        "address":  "7号线石厦站600m，新洲九街99号",
        "dishes":  "雪衣豆沙（狂推） 大拉皮 春饼合菜 大窑",
        "average":  "55",
        "rating":  "88",
        "note":  "锅包肉一般，但整体很正宗而且很便宜；+1票；感觉一般般"
    },
    {
        "district":  "福田",
        "name":  "雪乡之味东北菜",
        "address":  "福田街道牛巷坊54-1",
        "dishes":  "生腌基围虾兰花蟹皮皮虾血蛤，番薯粥，",
        "average":  "60",
        "rating":  "80",
        "note":  "潮汕人认可生腌；最近比较一般，生腌没那么新鲜"
    },
    {
        "district":  "福田",
        "name":  "牛巷番薯粥（非华强北）",
        "address":  "福田泰然八路(车公庙C)和后海大道旗舰店(南山书城附近)",
        "dishes":  "石橄榄鸡煲 奇味鸡煲",
        "average":  "70",
        "rating":  "90",
        "note":  "个人喜好重酱奇味"
    },
    {
        "district":  "福田",
        "name":  "洪大厨鸡煲",
        "address":  "上梅林梅村路22号",
        "dishes":  "炒米粉 酸菜炒大肠 盐焗鸡 盐焗粉肚",
        "average":  "70",
        "rating":  "80",
        "note":  "大排档环境 炒米粉35 贼大一盘！好吃！"
    },
    {
        "district":  "福田",
        "name":  "兴宁客家菜",
        "address":  "上梅林文体公园附近 3公里内店家包接送",
        "dishes":  "五花肉！肥牛！海带苗 烫啥都很好吃！",
        "average":  "70",
        "rating":  "95",
        "note":  "去了好多次啦，店家包接送，好吃又实惠！"
    },
    {
        "district":  "福田",
        "name":  "重庆三峡火锅",
        "address":  "莲花二村北门附近 莲花村地铁站",
        "dishes":  "烤鸡脆骨",
        "average":  "80",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "朱光玉火锅",
        "address":  "华强北街道燕南路c出口",
        "dishes":  "微辣锅已经狠辣了+番茄锅",
        "average":  "80",
        "rating":  "80",
        "note":  "番茄锅不蘸料都很有味道！店面很好看！！；+1票；朱光玉是我吃过最难吃的火锅，甚至还贵；这辈子没吃过这么难吃的火锅 又贵又难吃；越来越难吃了；又贵又难吃"
    },
    {
        "district":  "福田",
        "name":  "合气屋",
        "address":  "下沙b",
        "dishes":  "炸鸡 香芒鹅肝寿司",
        "average":  "80",
        "rating":  "80",
        "note":  "倒闭了"
    },
    {
        "district":  "福田",
        "name":  "李师傅脆肚",
        "address":  "梅林店，下梅林村梅华路锦林新居16栋首层，9号线梅景A1口300米",
        "dishes":  "脆肚",
        "average":  "88",
        "rating":  "90",
        "note":  "汤泡饭可以吃几碗的程度"
    },
    {
        "district":  "福田",
        "name":  "独饗自助火锅",
        "address":  "华强北站茂业天地",
        "dishes":  "冬阴功锅底qa",
        "average":  "98",
        "rating":  "95",
        "note":  "使劲儿炫海鲜"
    },
    {
        "district":  "福田",
        "name":  "小野町居酒屋",
        "address":  "上梅林中康路黄祠街南段梅林居（上梅林G口）",
        "dishes":  "强推明太子烤土豆和骰子牛肉，一些盐烤也不错",
        "average":  "100",
        "rating":  "隔一段时间就会馋一下",
        "note":  "人多要预约，店很小；倒闭了"
    },
    {
        "district":  "福田",
        "name":  "FineRao梵音轻体素食",
        "address":  "平安金融中心",
        "dishes":  "菌菇披萨",
        "average":  "100",
        "rating":  "95",
        "note":  "全素食，蘑菇吃起来像肉，很香，没有踩雷"
    },
    {
        "district":  "福田",
        "name":  "捞王锅物料理",
        "address":  "平安金融中心二楼",
        "dishes":  "胡椒猪肚鸡",
        "average":  "100",
        "rating":  "90",
        "note":  "好吃，可以淘宝买券；倒闭了"
    },
    {
        "district":  "福田",
        "name":  "板凳地摊烤肉",
        "address":  "上梅林新村25栋101",
        "dishes":  "肥牛 鸡脆骨 油边 鸡脚  必点牛肋条！！还有冷面！",
        "average":  "100",
        "rating":  "85",
        "note":  "店面挺接地气的 老板很热情 还会提醒要翻面"
    },
    {
        "district":  "福田",
        "name":  "川知味美蛙鱼头",
        "address":  "新世界百货楼下，上梅林新村17栋一层",
        "dishes":  "牛蛙！！！",
        "average":  "100",
        "rating":  "95",
        "note":  "想吃牛蛙就会去这家，推荐！；好吃！"
    },
    {
        "district":  "福田",
        "name":  "老大昌酒楼有限公司",
        "address":  "深南中路3019号福田大厦（深圳上海宾馆对面）",
        "dishes":  "江浙菜 所有招牌都好吃 熏鱼 小笼包 菜包\n葱爆鳝糊 油焖竹笋 鸭子",
        "average":  "100",
        "rating":  "98",
        "note":  "适合家庭聚餐跟喜欢吃江浙菜的人"
    },
    {
        "district":  "福田",
        "name":  "新马喜越",
        "address":  "振华路183号深圳辉盛阁国际公寓L113号铺",
        "dishes":  "每道菜都很好吃！",
        "average":  "106",
        "rating":  "90",
        "note":  "真的很好吃 具体看怎么点 日常其实人均40吃的也蛮香的了"
    },
    {
        "district":  "福田",
        "name":  "极浦亭花园餐厅(福田理想城店)",
        "address":  "福田梅林卓悦汇后面的理想时代大厦2楼",
        "dishes":  "捞粉 乳香肉包生（一人一块肉到两块肉就够了）\n不然会腻（尊的好吃） 沙姜焗大肠",
        "average":  "106",
        "rating":  "80",
        "note":  "正常要排队的，但是那个乳香肉真的好吃 记得要瘦一点的！！！！"
    },
    {
        "district":  "福田",
        "name":  "微醺实验室",
        "address":  "下沙地铁站c出口，盛唐大厦西座7楼",
        "dishes":  "喝鸡尾酒的",
        "average":  "180",
        "rating":  "95",
        "note":  "好好玩的小清吧！上次去都是帅哥美女"
    },
    {
        "district":  "福田",
        "name":  "大渔铁板烧(卓悦汇店)",
        "address":  "上梅林，卓悦汇购物中心F3",
        "dishes":  "自助餐",
        "average":  "260",
        "rating":  "95",
        "note":  "芝士口味的吃多会很腻，但适量还是很赞；+2票；想吃三文鱼的时候会去炫"
    },
    {
        "district":  "福田",
        "name":  "隐厨",
        "address":  "岗厦站b口",
        "dishes":  "土豆丝yyds",
        "average":  "100+",
        "rating":  "85",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "汤膳清远脆皮爽鸡",
        "address":  "回雁路景诚园综合楼A25号",
        "dishes":  "石橄榄脆皮鸡煲 五指毛桃脆皮鸡煲 捞粉等等都很好",
        "average":  "100以内",
        "rating":  "90",
        "note":  "鸡肉真的是脆的！！\n很好吃 汤底料足滋补又清甜"
    },
    {
        "district":  "福田",
        "name":  "酒京考宴",
        "address":  "下沙八坊",
        "dishes":  "待补充",
        "average":  "100左右",
        "rating":  "999",
        "note":  "好吃又便宜，但是得和店里预约才能吃，不知道现在是不是；下沙店，kkobe出来就是，从hou出来到地铁站。"
    },
    {
        "district":  "福田",
        "name":  "渔洲中山脆肉皖（新洲二街新店）",
        "address":  "沙尾或石厦",
        "dishes":  "脆肉皖",
        "average":  "100左右",
        "rating":  "90",
        "note":  "好吃且贵（招待朋友）"
    },
    {
        "district":  "福田",
        "name":  "山葵烤肉",
        "address":  "福田区东园路",
        "dishes":  "横膈膜，山葵酱",
        "average":  "110-160",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "新麻蒲韩国料理·韩国炭烧烤肉",
        "address":  "地铁1号线购物公园站B口步行310m，中洲湾b1也有",
        "dishes":  "护心肉、小菜、五花肉、猪颈肉",
        "average":  "150左右",
        "rating":  "85",
        "note":  "昭仪推荐韩国烤肉，环境个人觉得一般，房间里的桌子距离很近，不太适合和朋友沟通谈话，但是好在肉质还不错；三文鱼拌饭好好吃，而且才十几块钱超大一碗！\n店员会帮烤，吃太多肉会腻"
    },
    {
        "district":  "福田",
        "name":  "豪先生(JuenHo)",
        "address":  "圆岭四街95栋101-1（小区里）；红岭E口",
        "dishes":  "蛋糕！！！全部都好吃",
        "average":  "42左右",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "妈妈家铁锅炖",
        "address":  "景田D口",
        "dishes":  "排骨锅 东北拉皮 大拌菜 皮冻",
        "average":  "60-70",
        "rating":  "满分",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "冯四孃乐山跷脚牛肉",
        "address":  "车公庙，离hou不远了。",
        "dishes":  "跷脚牛肉，脑花，土豆丝。",
        "average":  "70到100",
        "rating":  "85",
        "note":  "某点评买多人套餐性价比很好。牛肉的汤很棒。；好吃 认证，他们的甜品不要点；+1票"
    },
    {
        "district":  "福田",
        "name":  "华师傅过桥米线",
        "address":  "",
        "dishes":  "柠檬水，雪王圣代，摩天脆脆，摇摇奶昔。",
        "average":  "8到15",
        "rating":  "99",
        "note":  "不许艾特雪王；@wim"
    },
    {
        "district":  "福田",
        "name":  "刚刚好意式披萨",
        "address":  "莲花北站A1出口",
        "dishes":  "披萨都好吃 最近热红酒也好喝",
        "average":  "丰俭由人 但是男孩子应该一顿吃俩(?",
        "rating":  "目前最喜欢的披萨店",
        "note":  "要预约 只有4张桌 除非特别冷没啥人"
    },
    {
        "district":  "福田",
        "name":  "乌鸦咖啡",
        "address":  "会展中心c口",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "东北磨磨东北菜",
        "address":  "岗厦D口",
        "dishes":  "奶香饼",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "大呲花丹东海鲜烤肉（梅林店）",
        "address":  "梅华路梅华一号大楼一层",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "大自然醉鹅",
        "address":  "上沙地铁站BC口上沙幼儿园附近开导航",
        "dishes":  "是大锅那种，醉鹅好入味，是愿意再去的店",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "我家楼下，已经倒闭了；+1票"
    },
    {
        "district":  "福田",
        "name":  "老长沙手工米粉铺(景田店)",
        "address":  "莲花街道梅富社区布尾村37号101",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "新白鹿餐厅",
        "address":  "车公庙附近",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "兰溪手工面",
        "address":  "",
        "dishes":  "肥肠牛肉炒面，",
        "average":  "30",
        "rating":  "99",
        "note":  "好吃是好吃，别饭点去，人太多了，"
    },
    {
        "district":  "福田",
        "name":  "白玉串城",
        "address":  "车公庙附近",
        "dishes":  "肥肠，各种肉",
        "average":  "120",
        "rating":  "95",
        "note":  "+1票"
    },
    {
        "district":  "福田",
        "name":  "茗星坊茶餐厅",
        "address":  "水围村",
        "dishes":  "漏奶华，惠灵顿牛排",
        "average":  "60",
        "rating":  "95",
        "note":  "+1票"
    },
    {
        "district":  "福田",
        "name":  "呷喱吧吧马来西亚茶餐厅",
        "address":  "车公庙附近",
        "dishes":  "肉骨茶",
        "average":  "70",
        "rating":  "95",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "天桥下肠粉",
        "address":  "景田地铁站500m",
        "dishes":  "深圳20+年特色肠粉",
        "average":  "10",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "普通食堂",
        "address":  "车公庙站F出口",
        "dishes":  "冷冻五花肉，炸泡菜饼，隐藏菜单etc.",
        "average":  "120",
        "rating":  "85",
        "note":  "韩国人老板，很首尔氛围，生日当天还有所有帅哥服务生围着拍照（牛郎感）；旺铺招租了"
    },
    {
        "district":  "福田",
        "name":  "古早味觉记忆坊",
        "address":  "上梅林 h出口广夏路合旺阁小区009号铺",
        "dishes":  "芋泥和原味跟的各色蛋糕",
        "average":  "25",
        "rating":  "100",
        "note":  "小店盛名，喜欢甜品的人真的非常非常喜欢，因为新鲜又好吃，就是经常排队；周一休息，有些款当天可能没有，提前在大众点评看下菜单"
    },
    {
        "district":  "福田",
        "name":  "沁心海南陵水酸粉(梅林店)",
        "address":  "梅村c2出口梅村路上梅林新村79号楼1层101号",
        "dishes":  "酸粉和清补凉",
        "average":  "20",
        "rating":  "85",
        "note":  "建议买点炸串陪酸粉顶呱呱"
    },
    {
        "district":  "福田",
        "name":  "土家酱香饼(上梅林新村店)",
        "address":  "C2出口附近梅村路上梅林新村内",
        "dishes":  "下午提前去，下班时间必排队，25年吃过最好的酱香饼",
        "average":  "5",
        "rating":  "100",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "周真真粉面",
        "address":  "华强北",
        "dishes":  "南昌拌粉、肉饼汤",
        "average":  "20",
        "rating":  "90",
        "note":  "+1票"
    },
    {
        "district":  "福田",
        "name":  "老味道粉面馆",
        "address":  "八卦岭",
        "dishes":  "麻酱拌面，特色腐皮鸡爪",
        "average":  "20",
        "rating":  "90",
        "note":  "晚上6点营业至凌晨两点，居民楼里，位置少，环境一般，但乌啦啦打卡！；+1票 细面好吃"
    },
    {
        "district":  "福田",
        "name":  "gala餐酒馆",
        "address":  "上梅林地铁站H口附近，离古早味不远",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "捞得美食",
        "address":  "石厦，具体地址看大众，要预约",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "阿润传统打边炉",
        "address":  "八卦路，梅林",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "福田",
        "name":  "火桶1971",
        "address":  "农林站A出口直行50过红绿灯对面二楼",
        "dishes":  "最正宗的韩式五花肉，韩国人聚集地",
        "average":  "100+",
        "rating":  "95",
        "note":  "周末晚上要排队，五花肉最好吃"
    },
    {
        "district":  "福田",
        "name":  "台小馆台湾风味",
        "address":  "下沙B口，在村里，不太好找，建议路上找外卖小哥晚霞",
        "dishes":  "三杯鸡套餐",
        "average":  "30",
        "rating":  "98",
        "note":  "大众点评买套餐券，16.9三杯鸡，老板现炒的，超级嫩"
    },
    {
        "district":  "福田",
        "name":  "妈妈家铁锅炖",
        "address":  "景田景诚园综合楼停车场",
        "dishes":  "铁锅炖系列都好吃",
        "average":  "90",
        "rating":  "95",
        "note":  "东北朋友都说和老家的一个味好吃，别连锁店的好吃，就是上菜有点慢"
    },
    {
        "district":  "福田",
        "name":  "老周记顺德双皮奶",
        "address":  "梅村C1出口上梅林新村3栋3-2号",
        "dishes":  "鹰嘴豆双皮奶！",
        "average":  "20",
        "rating":  "90",
        "note":  "原味也很可"
    },
    {
        "district":  "福田",
        "name":  "牧渔人家潮汕卤水火锅",
        "address":  "中国广东省深圳市福田区福田区皇岗上围一村1-5-1(广场楼)",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "老板娘态度很好！！！"
    },
    {
        "district":  "福田",
        "name":  "猴姐鹤岗小串",
        "address":  "梅华路321-18号（梅景地铁站A1口步行330米）",
        "dishes":  "肥瘦加糖！烤油边！小牛肉超级好吃",
        "average":  "60",
        "rating":  "90",
        "note":  "老板纯正的东北鹤岗人，味道绝绝的正宗！"
    },
    {
        "district":  "福田",
        "name":  "闻老头菊花碳烤肉",
        "address":  "梅林街道中康路卓悦汇 4号线上梅林站L口",
        "dishes":  "烤肉都挺好吃😋 还有鳕鱼嘎嘎香 免费的南瓜粥我最爱！！",
        "average":  "100+",
        "rating":  "💯-2",
        "note":  "服务不错 服务员都会帮烤 去深圳两次吃的都是这家"
    },
    {
        "district":  "福田",
        "name":  "葭喜冰室(中洲湾店)",
        "address":  "中洲湾CFuture购物中心北区B2F楼B209商铺",
        "dishes":  "芝士抹茶、芝士芒果西瓜、巧克力芝士牛奶冰",
        "average":  "30",
        "rating":  "100",
        "note":  "夏天喜欢吃冰冰甜品的福利，味道非常好，又丰富；＋1，已经去过2会，抹茶yyds"
    },
    {
        "district":  "福田",
        "name":  "锅太鲜•卤味螺蛳粉",
        "address":  "花样年•花好园一层裙楼外围124-下沙B口步行100m",
        "dishes":  "卤味螺蛳粉",
        "average":  "18",
        "rating":  "100",
        "note":  "好吃，甜辣的螺蛳粉，正宗的螺蛳粉，家人们谁懂，可以选粉的软硬。；美团搜得到，导航更直接"
    },
    {
        "district":  "福田",
        "name":  "张张面包店",
        "address":  "黄祠巷105号（上梅林G口步行330米）",
        "dishes":  "大蒜面包最火，个人最爱香肠乳酪贝果",
        "average":  "24",
        "rating":  "100",
        "note":  "每周四休息，提前在大众点评看下菜单有面包出炉时间，刚出炉的更香；热的大蒜面包超级好吃！！"
    },
    {
        "district":  "福田",
        "name":  "卡丹新疆烧烤",
        "address":  "福田区南园路82号 科学馆C出去200米",
        "dishes":  "丁丁炒面 羊肉包子 椒麻鸡 地道新疆烧烤 有很多新疆人和外国人",
        "average":  "70",
        "rating":  "95",
        "note":  "适合人多一起吃 菜码比较大份，不要点鸡翅（奥尔良预制的）吃肉好吃"
    },
    {
        "district":  "福田",
        "name":  "艾薇达欧包",
        "address":  "福民地铁站J2口",
        "dishes":  "日式红豆黄油法棍（巨巨巨好吃，每天11点出炉，限量供应）",
        "average":  "40",
        "rating":  "99",
        "note":  "这家必须榜上有名，1分是扣在单价贵，但欧包都是用的进口法国面粉，真的很香不开玩笑！法棍类的真的很香很有劲道，因为是台湾面包店所以甜包会有点偏甜"
    },
    {
        "district":  "福田",
        "name":  "卖鱼佬砂锅粥",
        "address":  "上梅林新村里面（查美团看地址）",
        "dishes":  "推荐砂锅粥，金不换吹筒，鸭舌",
        "average":  "70",
        "rating":  "100",
        "note":  "吃了好多回，每次新朋友组局就往那带，晚上会人多；比较清淡个人感觉"
    },
    {
        "district":  "福田",
        "name":  "潮山鸡",
        "address":  "梅林生活中心对面",
        "dishes":  "鸡煲你就吃吧！",
        "average":  "50-60",
        "rating":  "95",
        "note":  "开车来不要停对面梅林生活中心35一小时第二小时5块！！"
    },
    {
        "district":  "福田",
        "name":  "妈妈咪呀印度餐厅",
        "address":  "华强北",
        "dishes":  "玛莎拉咖喱鸡 印度奶昔",
        "average":  "80-100",
        "rating":  "90",
        "note":  "点菜的服务员会说中文"
    },
    {
        "district":  "福田",
        "name":  "子午路张记肉夹馍",
        "address":  "华强北",
        "dishes":  "必须肉臊拉条子，西安读书的时候很爱吃他家的腊汁肉拌面，现在开了深圳唯一分店，肉夹馍，米皮和拌面都是陕西面独一档",
        "average":  "30",
        "rating":  "待补充",
        "note":  "陕西面"
    },
    {
        "district":  "福田",
        "name":  "窑滚福田店",
        "address":  "卓悦中心B1，岗厦站B出口",
        "dishes":  "all恰巴塔，明太子法棍",
        "average":  "30",
        "rating":  "90",
        "note":  "暂无备注"
    },
    {
        "district":  "大鹏",
        "name":  "紫金八刀汤",
        "address":  "大鹏新区党群服务中心对面",
        "dishes":  "紫金八刀汤（猪杂汤）、瘦肉汤、瘦肉粥。猪杂汤、瘦肉汤非常鲜甜。工作日中午晚上都有，中午有时候十二点多到已经没了，晚上最晚要七点之前。周末晚上没有。",
        "average":  "15",
        "rating":  "8",
        "note":  "暂无备注"
    },
    {
        "district":  "大鹏",
        "name":  "淮南牛肉汤",
        "address":  "",
        "dishes":  "三合一，淮南牛肉汤",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "大鹏",
        "name":  "常德牛肉粉",
        "address":  "",
        "dishes":  "麻辣干拌粉",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "光明",
        "name":  "梁记柳州螺蛳粉",
        "address":  "甲子塘村里",
        "dishes":  "螺蛳粉（狂加折耳根）",
        "average":  "18",
        "rating":  "4.5",
        "note":  "离sofun还是有点远的 4km把"
    },
    {
        "district":  "光明",
        "name":  "下村米店",
        "address":  "合水口地铁站旁边的下村",
        "dishes":  "炸鸡翅，香芋油滋",
        "average":  "15",
        "rating":  "90",
        "note":  "距离地铁口有点远，还要步行10min，但挺好吃的！！"
    },
    {
        "district":  "光明",
        "name":  "下村新强记",
        "address":  "合水口地铁站旁边的下村",
        "dishes":  "烧鹅",
        "average":  "100",
        "rating":  "85",
        "note":  "目前吃到的最好吃的烧腊，但还是离地铁口很远，虽然有外卖但更贵"
    },
    {
        "district":  "光明",
        "name":  "淘蛙（光明万达店）",
        "address":  "凤凰城地铁口",
        "dishes":  "麻辣火锅的干锅蛙（具体口味不记得了，但麻辣火锅最辣且招牌的那个",
        "average":  "150",
        "rating":  "90",
        "note":  "跟叙知香很像，但没那么麻又更辣了！！好吃"
    },
    {
        "district":  "光明",
        "name":  "余记肠粉店",
        "address":  "光明大街295号东区5栋一号，在巷子里",
        "dishes":  "越南肠粉、滴漏咖啡、大小云吞",
        "average":  "35",
        "rating":  "90",
        "note":  "作为光明开了几十年的老店来说能够保持一贯的出品相对稳定不错了"
    },
    {
        "district":  "光明",
        "name":  "新湖十一烧鸡",
        "address":  "圳美A1口往前走600米",
        "dishes":  "烧鸡，米粉",
        "average":  "50",
        "rating":  "90",
        "note":  "量大，两个人吃一只烧鸡和米粉都很饱了，味道不错，茶位费1块钱！！"
    },
    {
        "district":  "光明",
        "name":  "金稻田面包屋",
        "address":  "光明大街地铁站附近",
        "dishes":  "抹茶蛋糕、卤鸡翅",
        "average":  "8",
        "rating":  "90",
        "note":  "抹茶脑袋的最爱，蛋糕7-9元一个，奶油不多但味道不错"
    },
    {
        "district":  "光明",
        "name":  "囍记糖水",
        "address":  "楼村小学附近",
        "dishes":  "西米",
        "average":  "10",
        "rating":  "90",
        "note":  "西米糖水、双皮奶不错，绿豆糖水不推荐，太稠了"
    },
    {
        "district":  "光明",
        "name":  "光明芳斐乳鸽",
        "address":  "光明大街地铁站附近 在光明招待所对面",
        "dishes":  "乳鸽 牛初乳",
        "average":  "四十",
        "rating":  "90",
        "note":  "乳鸽很推荐 很嫩 其他看自己喜欢 光明三宝是乳鸽 牛初乳 玉米"
    },
    {
        "district":  "光明",
        "name":  "蜀姐麻辣烫",
        "address":  "合水口c口的小吃摊里",
        "dishes":  "酥肉",
        "average":  "15",
        "rating":  "100",
        "note":  "好好吃好好吃好好吃 基本天天吃不夸张了"
    },
    {
        "district":  "光明",
        "name":  "广西夜江湖炭火烧烤（果酱烧烤）",
        "address":  "新庄地铁站附近",
        "dishes":  "肉串都是当天的很新鲜",
        "average":  "50",
        "rating":  "90",
        "note":  "人多的时候烤的有点慢"
    },
    {
        "district":  "光明",
        "name":  "老妈麻辣烫",
        "address":  "光明马田街道横岭新村6巷9号（合水口地铁站旁边）",
        "dishes":  "龙口粉丝+公仔面+鱿鱼+鸭血+鱼蛋+其它",
        "average":  "20",
        "rating":  "100",
        "note":  "深圳最好吃的麻辣烫！！！9年老店。（注意附近有个同名的别走错了）"
    },
    {
        "district":  "光明",
        "name":  "来福农家院子",
        "address":  "国际会展中心店",
        "dishes":  "瓦罐鸡饭，冬瓜盅，烧鹅，河虾河蟹，河豚汤",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "鸡饭很香，冬瓜盅要早点去不然就没了"
    },
    {
        "district":  "盐田",
        "name":  "盐田得米肠粉",
        "address":  "北山道33号",
        "dishes":  "豆浆 油条 蛋肉肠粉 （晚上 宵夜来吃不错",
        "average":  "20",
        "rating":  "8分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "山水肠粉",
        "address":  "导航沙头角中学附近",
        "dishes":  "蛋肉肠粉 卤水鸡翅鸡爪",
        "average":  "30",
        "rating":  "7分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "和味龟苓膏",
        "address":  "沙头角东和路华侨新村13栋1A西侧",
        "dishes":  "我觉得比前面两家肠粉好吃 炼乳龟苓膏好吃",
        "average":  "20",
        "rating":  "8.9分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "紫梅汤粉",
        "address":  "东和路35号",
        "dishes":  "中午一点之前去 不然会卖完 汤米粉（胡椒味便重",
        "average":  "15",
        "rating":  "9分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "香港风味小吃",
        "address":  "海涛路8号",
        "dishes":  "炸酱肠粉 虾条 牛腩萝卜汤",
        "average":  "30",
        "rating":  "8分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "云吞王",
        "address":  "三家店公交站下车 田心菜市场旁",
        "dishes":  "净云吞 云吞捞面",
        "average":  "23",
        "rating":  "8分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "故乡小厨",
        "address":  "沙头角口岸公交站附近",
        "dishes":  "卤肉饭 炒猪脚皮",
        "average":  "丰俭由人",
        "rating":  "9分",
        "note":  "台湾菜！营业时间短！不要跑空！卤肉饭必点！还有仙草蜜！不用点那么多！很下饭！；其实我觉得有点一般般"
    },
    {
        "district":  "盐田",
        "name":  "和记砂锅粥",
        "address":  "田东中学对面",
        "dishes":  "砂锅粥（虾+鸡打底，其他可以任加），可以打电话提前点单，不然一锅粥要等四十多分钟。吃过的都说香，二十年老店",
        "average":  "60",
        "rating":  "9.5分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "钙骨汤粉王",
        "address":  "导航田东中学附近",
        "dishes":  "猪杂汤或者猪肉汤粉就行，老板脾气差，但是真好吃，辣椒也香",
        "average":  "15",
        "rating":  "8分",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "大家旺面包店",
        "address":  "直接大众点评",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "福满轩烧烤（电信楼店）",
        "address":  "沙盐路3015号电信楼F1层（VIVO授权体验店隔壁）",
        "dishes":  "嫩牛肉!！老板6点半开门记得提前来点菜，要不然晚点会排队",
        "average":  "丰俭由人",
        "rating":  "9",
        "note":  "暂无备注"
    },
    {
        "district":  "盐田",
        "name":  "BusyBeePizza忙碌蜜蜂披萨摊",
        "address":  "海景路棕榈湾花园海边",
        "dishes":  "焦糖莓果，辣番茄牛肉红酱，最好现场吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "潮州鲜虾肠粉店",
        "address":  "坪山街道立新东路31-2",
        "dishes":  "鲜虾牛肉肠粉等海鲜肠粉。给的肉老多了，贼拉香",
        "average":  "25",
        "rating":  "8.5",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "白塔洪记鲜牛肉店",
        "address":  "坪山中兴路18号",
        "dishes":  "鲜牛肉汤，湿炒牛河。肉鲜切的，跟不要钱似的给，汤香死了",
        "average":  "25",
        "rating":  "9",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "小筋牛·小铝盆烤肉",
        "address":  "坪环社区马峦路106号坪环市场第2栋",
        "dishes":  "直接点套餐，牛肠牛肉都好吃。正宗东北人认证～",
        "average":  "50",
        "rating":  "8.5",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "米妮沙拉",
        "address":  "坑梓站吉祥路",
        "dishes":  "牛排很好吃",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "水木寿司",
        "address":  "坑梓站人民西路28号",
        "dishes":  "和风牛肉（洋葱牛肉）特好吃，鳗鱼炒饭也不错",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "如意牛肉店",
        "address":  "东纵路74号",
        "dishes":  "牛肉火锅、凉拌牛肉",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "电白鸭粥",
        "address":  "坑梓",
        "dishes":  "白斩鸭，捞粉",
        "average":  "50",
        "rating":  "满婚10",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "陈记罐罐香米线",
        "address":  "坑梓",
        "dishes":  "泡椒鸡杂米线",
        "average":  "20",
        "rating":  "100分啊啊啊",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "家祺文昌椰子鸡",
        "address":  "坑梓影剧院旁边",
        "dishes":  "请点带虾滑的套餐，虾滑煲仔饭椰子鸡都新鲜好吃",
        "average":  "80",
        "rating":  "10",
        "note":  "暂无备注"
    },
    {
        "district":  "坪山",
        "name":  "肥佬永鑫现宰猪杂汤",
        "address":  "坪山区龙兴北路49号",
        "dishes":  "猪杂粥 椒盐生蚝 通心菜",
        "average":  "60",
        "rating":  "95",
        "note":  "说实话一般，服务也差"
    },
    {
        "district":  "其他",
        "name":  "堂会",
        "address":  "",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "KTV"
    },
    {
        "district":  "其他",
        "name":  "纯K",
        "address":  "",
        "dishes":  "待补充",
        "average":  "待补充",
        "rating":  "待补充",
        "note":  "KTV"
    },
    {
        "district":  "其他",
        "name":  "汤悦",
        "address":  "福田，泰然九路14号",
        "dishes":  "纯泡汤",
        "average":  "250",
        "rating":  "99",
        "note":  "泡汤，环境很好，适合年轻人去"
    }
];
let sheetAvoidData = [
    {
        "district":  "避雷",
        "name":  "宽窄宅院火锅",
        "address":  "龙岗万达华南城",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "难吃",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "龙门花甲",
        "address":  "车公庙",
        "dishes":  "不推荐",
        "average":  "30-50",
        "rating":  "避雷",
        "note":  "难吃性价比低贵\n海岸城的龙门花甲还挺好吃的",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "东北磨磨东北菜",
        "address":  "卓悦intown",
        "dishes":  "不推荐",
        "average":  "60",
        "rating":  "避雷",
        "note":  "一点都不东北！！ （复议！锅包肉老硬了）",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "普通食堂",
        "address":  "车公庙",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "菜品很一般 长这么大吃过最难吃的韩料",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "山河屯铁锅炖南山店",
        "address":  "南山地铁站",
        "dishes":  "垃圾",
        "average":  "94",
        "rating":  "避雷",
        "note":  "贵，难吃，不像东北菜，",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "椰客（椰子鸡）",
        "address":  "万科云城",
        "dishes":  "垃圾，鸡腥",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "贵，难吃，5个人人均90吃不了一只鸡",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "重庆鸡公煲",
        "address":  "深职院附近",
        "dishes":  "不推荐",
        "average":  "茶水位60",
        "rating":  "避雷",
        "note":  "上菜慢 难吃 量少",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "楠火锅",
        "address":  "会展中心",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "味道服务环境各方面都不佳，通风差",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "潮香四海",
        "address":  "车公庙",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "排队，一点也不潮汕菜，打着潮汕菜的名称",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "好好味面馆",
        "address":  "南山",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "饭点高峰期等半小时就为吃个味道没有多惊艳的混沌，纯纯大冤种，错过饭点，不用排对去尝尝鲜还行",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "石灰石烧鸡公",
        "address":  "车公庙",
        "dishes":  "不推荐",
        "average":  "80",
        "rating":  "避雷",
        "note":  "料理包 不好吃",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "杉姐老火锅",
        "address":  "南山地铁站",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "排队 锅底苦 辣锅没有九宫格",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "外婆家",
        "address":  "上梅林卓悦汇",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "不新鲜，难吃!",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "友记茶餐厅",
        "address":  "靠近罗湖口岸 汇泰大厦店",
        "dishes":  "不推荐",
        "average":  "60",
        "rating":  "避雷",
        "note":  "口岸边专门宰人的 很难吃 有隐形消费",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "金胖肉蟹煲（五和店）",
        "address":  "五和地铁口H口",
        "dishes":  "不推荐",
        "average":  "80",
        "rating":  "避雷",
        "note":  "贼难吃还贼多人排队，非常不理解！！！蟹是臭的，服务态度极差！！！",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "伟记潮汕土鸡煲",
        "address":  "车公庙",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "上菜超慢，等一个多钟都没上汤底？上个汤底都那么难吗",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "DIMARIA（土耳其美食）",
        "address":  "坪洲地铁站",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "不符合中国人口味",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "首秀（川菜）",
        "address":  "坂田佳华",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "预制菜，巨难吃，川菜馆子主打的竟然是小龙虾，空调不凉",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "百草堂",
        "address":  "蛇口东角头",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "排队很久，分量小 贵 且难吃，钱多爱排队的随意；附议！！！早知道先提前看一下这里了。难吃倒不至于 但是太贵了，能吃出来材料挺干净新鲜的",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "幻师Commune",
        "address":  "海岸城",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "从德国猪肘到意面没有一道过及格线（个人主观感受），当事人相当后悔",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "杨元杨重庆老火锅",
        "address":  "五和地铁口C口",
        "dishes":  "不推荐",
        "average":  "100",
        "rating":  "避雷",
        "note":  "店里没有空调的 只有风扇 （有点久远了记不清具体味道了）反正吃完体验感很差 人均也不便宜 菜不新鲜 吃完感觉就是有种垃圾油蒙住胃的感觉",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "沿山花园台湾餐厅",
        "address":  "蛇口花果山",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "老板正宗台湾人，点了台湾卤肉饭，台湾腔真的拉满期待值了，卤肉饭是甜口的，看着很像料理包，但是应该不是，味道很淡，还有一些萝卜丁，小绿豆，酸菜，西红柿炒蛋，不是很难吃但是也不好吃，最主要是卤肉卤味不强，饭也很烂，和速食米饭一样烂",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "韩欢喜拌饭·创意朝鲜族料理(宏发领域荟店)",
        "address":  "宝安中心店",
        "dishes":  "不推荐",
        "average":  "60",
        "rating":  "避雷",
        "note":  "刷新部队火锅观念，更不想尝试韩料了。",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "姜虎东白丁烤肉",
        "address":  "卓悦中心",
        "dishes":  "超级不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "和朋友坐着等上菜，两个手掌大的老鼠从后厨穿越到水吧! 其实这家烤肉主理人是料理鼠王",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "大无烧肉",
        "address":  "深圳湾万象城二期",
        "dishes":  "超级不推荐",
        "average":  "800",
        "rating":  "避雷",
        "note":  "这个价位可以吃到更好的烧肉…套餐里面的海胆质量也不好。需要提前预定的牛舌是好吃的，但是不符合这个价位",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "KABABCHA卡巴沙土耳其巴基斯坦餐厅(清真)",
        "address":  "",
        "dishes":  "不推荐",
        "average":  "待补充",
        "rating":  "避雷",
        "note":  "未填写避雷理由",
        "type":  "avoid"
    },
    {
        "district":  "避雷",
        "name":  "牛憨憨大排档",
        "address":  "杨美",
        "dishes":  "超级不推荐",
        "average":  "50-100",
        "rating":  "避雷",
        "note":  "非常难吃，所有烧烤类油多到离谱，怀疑是油炸的",
        "type":  "avoid"
    }
];
const questTitles = {
  venture: "2024.05-2026.3 | 创业：移民 & 美区TK & 抖音",
  qianyudao: "2023.12-2024.04 | 深圳市乾有道文旅数字投资有限公司",
  lisen: "2022-08 ~ 2023-12 | 深圳市李森科技有限公司",
  college: "2022.06 | 广东岭南职业技术学院",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "#";
  } catch {
    return "#";
  }
}

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function loadFoodSeenCounts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(foodSeenStorageKey) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveFoodSeenCounts(seenCounts) {
  try {
    const entries = Object.entries(seenCounts)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, maxSeenHistoryItems);
    localStorage.setItem(foodSeenStorageKey, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // Browsers can block localStorage in strict modes; random selection should still work.
  }
}

function getMerchantMemoryKey(merchant) {
  return String(merchant.id || `${merchant.name || ""}|${merchant.address || ""}`).trim();
}

function loadSeenCounts(storageKey) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveSeenCounts(storageKey, seenCounts) {
  try {
    const entries = Object.entries(seenCounts)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, maxSeenHistoryItems);
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // Random selection should still work when storage is blocked.
  }
}

function pickWeightedMerchants(merchants, count, shouldRemember = false) {
  const selected = [];
  const pool = shuffleItems(merchants);
  const seenCounts = loadSeenCounts(foodSeenStorageKey);

  while (pool.length && selected.length < count) {
    const weightedPool = pool.map((merchant) => {
      const seenCount = Number(seenCounts[getMerchantMemoryKey(merchant)] || 0);
      const freshBoost = seenCount === 0 ? 1.35 : 1;
      const weight = freshBoost / Math.pow(seenCount + 1, 1.75);

      return {
        merchant,
        weight: weight * (0.72 + Math.random() * 0.56),
      };
    });
    const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * totalWeight;
    let pickedIndex = 0;

    for (let index = 0; index < weightedPool.length; index += 1) {
      cursor -= weightedPool[index].weight;
      if (cursor <= 0) {
        pickedIndex = index;
        break;
      }
    }

    const [picked] = pool.splice(pickedIndex, 1);
    selected.push(picked);
  }

  if (shouldRemember) {
    selected.forEach((merchant) => {
      const key = getMerchantMemoryKey(merchant);
      seenCounts[key] = Number(seenCounts[key] || 0) + 1;
    });
    saveSeenCounts(foodSeenStorageKey, seenCounts);
  }

  return selected;
}

function getSheetItemKey(item) {
  return `${item.district}|${item.name}`;
}

function getVisibleSheetItems() {
  if (sheetFoodState.district === "避雷") {
    return sheetAvoidData;
  }

  return sheetFoodState.district === "全部"
    ? sheetFoodData
    : sheetFoodData.filter((item) => item.district === sheetFoodState.district);
}

function pickWeightedSheetItem(items) {
  const seenCounts = loadSeenCounts(sheetSeenStorageKey);
  const weightedItems = items.map((item) => {
    const seenCount = Number(seenCounts[getSheetItemKey(item)] || 0);
    const weight = (seenCount === 0 ? 1.4 : 1) / Math.pow(seenCount + 1, 1.7);

    return {
      item,
      weight: weight * (0.75 + Math.random() * 0.5),
    };
  });
  const totalWeight = weightedItems.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = Math.random() * totalWeight;
  let picked = weightedItems[0]?.item;

  for (const entry of weightedItems) {
    cursor -= entry.weight;
    if (cursor <= 0) {
      picked = entry.item;
      break;
    }
  }

  if (picked) {
    const key = getSheetItemKey(picked);
    seenCounts[key] = Number(seenCounts[key] || 0) + 1;
    saveSeenCounts(sheetSeenStorageKey, seenCounts);
  }

  return picked;
}

function createSheetDianpingUrl(item) {
  return createDianpingSearchUrl({
    name: item.name,
    cityname: "深圳市",
  });
}

function createSheetAmapUrl(item) {
  const district = item.district === "其他" || item.district === "避雷" ? "" : item.district;
  const keyword = ["深圳", district, item.name].filter(Boolean).join(" ");
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}&callnative=1`;
}

function formatSheetAverage(average) {
  const text = String(average || "").trim();
  if (!text || text === "待补充") {
    return "待补充";
  }

  return /[元块￥¥]/.test(text) ? text : `${text} 元`;
}

function renderSheetFoodCard(item, picked = false) {
  const className = [
    "sheet-food-card",
    picked ? "picked-sheet-food-card" : "",
    item.type === "avoid" ? "sheet-avoid-card" : "",
  ].filter(Boolean).join(" ");
  const amapUrl = safeHttpUrl(createSheetAmapUrl(item));
  const dianpingUrl = safeHttpUrl(createSheetDianpingUrl(item));
  const noteLabel = item.type === "avoid" ? "避雷理由" : "备注";
  const averageText = formatSheetAverage(item.average);
  const ratingText = item.type === "avoid" ? "避雷" : `★ ${escapeHtml(item.rating)}`;

  return `
    <article class="${className}">
      <div class="sheet-card-top">
        <span>${escapeHtml(item.district)}</span>
        <strong>${ratingText}</strong>
      </div>
      <h3>${escapeHtml(item.name)}</h3>
      <dl>
        <div><dt>地址</dt><dd>${escapeHtml(item.address || "待补充")}</dd></div>
        <div><dt>${item.type === "avoid" ? "记录" : "推荐菜"}</dt><dd>${escapeHtml(item.dishes)}</dd></div>
        <div><dt>人均</dt><dd>${escapeHtml(averageText)}</dd></div>
        <div><dt>${noteLabel}</dt><dd>${escapeHtml(item.note)}</dd></div>
      </dl>
      <div class="sheet-link-row">
        <a href="${amapUrl}" target="_blank" rel="noreferrer">高德搜店名</a>
        <a href="${dianpingUrl}" target="_blank" rel="noreferrer">大众点评</a>
      </div>
    </article>
  `;
}

function renderSheetDistricts() {
  if (!sheetDistricts) return;

  const districts = ["全部", ...new Set(sheetFoodData.map((item) => item.district)), "避雷"];
  sheetDistricts.innerHTML = districts.map((district) => `
    <button class="${district === sheetFoodState.district ? "is-selected" : ""}" type="button" data-sheet-district="${escapeHtml(district)}">
      ${escapeHtml(district)}
    </button>
  `).join("");
}

function renderSheetFoodLibrary() {
  if (!sheetResults || !sheetCount) return;

  const visibleItems = getVisibleSheetItems();
  sheetCount.textContent = sheetFoodState.district === "避雷"
    ? `当前展示 ${visibleItems.length} 条避雷记录。`
    : `当前展示 ${visibleItems.length} 家。`;
  sheetResults.innerHTML = visibleItems.map((item) => renderSheetFoodCard(item)).join("");
}

function openRandomSheetFood() {
  if (!sheetOverlay || !sheetPicked) return;

  const visibleItems = getVisibleSheetItems();
  const picked = pickWeightedSheetItem(visibleItems);
  if (!picked) return;

  sheetPicked.innerHTML = renderSheetFoodCard(picked, true);
  sheetOverlay.hidden = false;
}

function readLngLat(location) {
  if (Array.isArray(location)) {
    return [Number(location[0]), Number(location[1])];
  }

  return [
    Number(location?.lng ?? location?.getLng?.()),
    Number(location?.lat ?? location?.getLat?.()),
  ];
}

function normalizeAmapCenter(AMap, location) {
  const [lng, lat] = readLngLat(location);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return location;
  }

  if (typeof AMap.LngLat === "function") {
    return new AMap.LngLat(lng, lat);
  }

  return [lng, lat];
}

function setSelected(group, value) {
  group?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.value === value);
  });
}

function getFoodSearchKey() {
  const resolvedCenterKey = foodState.resolvedCenter
    ? foodState.resolvedCenter.map((value) => Number(value).toFixed(6)).join(",")
    : "";

  return [
    foodPlaceInput?.value.trim() || "",
    resolvedCenterKey,
    foodState.category,
    foodState.distance,
  ].join("|");
}

function updateFoodSearchButtonLabel() {
  if (!foodSearchButton) return;

  const currentKey = getFoodSearchKey();
  const label = foodState.lastSearchKey && currentKey === foodState.lastSearchKey
    ? "重新刷新附近美食"
    : "搜索附近美食";
  const labelNode = foodSearchButton.querySelector("[data-food-search-label]");

  if (labelNode) {
    labelNode.textContent = label;
  } else {
    foodSearchButton.textContent = label;
  }
}

function renderFoodMessage(title, text) {
  if (!foodResults || !foodCount || !foodRandomButton) return;

  foodState.merchants = [];
  foodResults.innerHTML = `
    <article class="food-empty-card">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(text)}</p>
    </article>
  `;
  foodCount.textContent = "还没有可随机的商家";
  setFoodRandomDisabled(true);
}

function createDianpingSearchUrl(merchant) {
  const dianpingCityIds = {
    上海: 1,
    北京: 2,
    杭州: 3,
    广州: 4,
    南京: 5,
    苏州: 6,
    深圳: 7,
    成都: 8,
    重庆: 9,
    天津: 10,
    武汉: 16,
    西安: 17,
  };
  const cityName = String(merchant.cityname || "").replace("市", "");
  const cityId = dianpingCityIds[cityName] || 7;
  const keyword = encodeURIComponent(String(merchant.name || "").trim());
  return `https://www.dianping.com/search/keyword/${cityId}/0_${keyword}`;
}

function createAmapNavigationUrl(merchant) {
  const location = merchant.location;
  const [lng, lat] = readLngLat(location);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return `https://uri.amap.com/search?keyword=${encodeURIComponent(merchant.name || "")}&callnative=1`;
  }

  return `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(merchant.name || "")}&mode=walk&src=xujiajie-site&coordinate=gaode&callnative=1`;
}

function renderFoodCard(merchant, picked = false) {
  const articleClass = picked ? "picked-food-card" : "food-card";
  const contentClass = picked ? "picked-food-card-content" : "food-card-content";
  const image = merchant.image || "./assets/food-placeholder.svg";
  const distance = merchant.distance ? `距离你 ${escapeHtml(merchant.distance)} 米` : "距离你未知";
  const url = safeHttpUrl(merchant.url || createDianpingSearchUrl(merchant));
  const mapUrl = safeHttpUrl(createAmapNavigationUrl(merchant));

  return `
    <article class="${articleClass}">
      <img src="${safeHttpUrl(image) === "#" ? "./assets/food-placeholder.svg" : safeHttpUrl(image)}" alt="${escapeHtml(merchant.name)}" />
      <div class="${contentClass}">
        <h3>${escapeHtml(merchant.name)}</h3>
        <p>${escapeHtml(merchant.summary || "接入真实数据后，这里会展示商家的简易评价。")}</p>
        <div class="food-meta">
          <span>${distance}</span>
        </div>
        <div class="food-link-row">
          <a href="${url}" target="_blank" rel="noreferrer">大众点评搜店名</a>
          <a href="${mapUrl}" target="_blank" rel="noreferrer">查看定位</a>
        </div>
      </div>
    </article>
  `;
}

function openRandomFood() {
  if (!foodState.merchants.length || !foodOverlay || !foodPicked) return;

  const picked = foodState.merchants[Math.floor(Math.random() * foodState.merchants.length)];
  foodPicked.innerHTML = renderFoodCard(picked, true);
  foodOverlay.hidden = false;
}

function getFoodRadius() {
  if (foodState.distance === "nearby") return 2000;
  return Number(foodState.distance) || 2000;
}

function getFoodKeywords() {
  const keywords = {
    all: ["餐饮服务", "餐厅", "美食", "小吃", "中餐厅", "火锅", "烧烤", "快餐", "咖啡", "奶茶", "饮品"],
    meal: ["餐饮服务", "餐厅", "中餐厅", "火锅", "烧烤", "快餐", "小吃", "茶餐厅", "粤菜"],
    drink: ["奶茶", "咖啡", "饮品", "茶饮", "咖啡厅"],
  };

  return shuffleItems(keywords[foodState.category] || keywords.all);
}

function loadAmap() {
  if (!amapConfig.key) {
    return Promise.reject(new Error("missing amap key"));
  }

  if (window.AMap) {
    return Promise.resolve(window.AMap);
  }

  window._AMapSecurityConfig = {
    securityJsCode: amapConfig.securityJsCode,
  };

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(amapConfig.key)}&plugin=AMap.Geocoder,AMap.PlaceSearch`;
    script.async = true;
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error("amap script loaded without AMap"));
      }
    };
    script.onerror = () => reject(new Error("amap load failed"));
    document.head.append(script);
  });
}

function searchPlaceLocation(AMap, place) {
  return new Promise((resolve, reject) => {
    const searcher = new AMap.PlaceSearch({
      pageSize: 1,
      pageIndex: 1,
      extensions: "base",
    });

    searcher.search(place, (status, result) => {
      const location = result?.poiList?.pois?.[0]?.location;
      if (status === "complete" && location) {
        resolve(location);
      } else {
        reject(new Error(`poi place not found: ${status}`));
      }
    });
  });
}

function searchPlaceSuggestions(AMap, query) {
  return new Promise((resolve) => {
    const searcher = new AMap.PlaceSearch({
      pageSize: maxPlaceSuggestions,
      pageIndex: 1,
      citylimit: false,
      extensions: "base",
    });

    searcher.search(query, (status, result) => {
      if (status === "complete") {
        resolve(result?.poiList?.pois || []);
      } else {
        resolve([]);
      }
    });
  });
}

function getPlaceSuggestionLabel(poi) {
  const city = String(poi.cityname || poi.pname || "").replace("市", "");
  const district = String(poi.adname || "");
  const address = String(poi.address || "");

  return [city, district, address]
    .filter(Boolean)
    .join(" · ");
}

function getSelectedPlaceDisplay(poi) {
  const name = String(poi?.name || "").trim();
  const label = getPlaceSuggestionLabel(poi);

  return [name, label].filter(Boolean).join("｜");
}

function hidePlaceSuggestions() {
  foodState.placeSuggestions = [];
  if (foodPlaceSuggestions) {
    foodPlaceSuggestions.hidden = true;
    foodPlaceSuggestions.innerHTML = "";
  }
}

function renderPlaceSuggestions(suggestions, note = "") {
  if (!foodPlaceSuggestions) return;

  foodState.placeSuggestions = suggestions;

  if (!suggestions.length) {
    foodPlaceSuggestions.hidden = false;
    foodPlaceSuggestions.innerHTML = `
      <div class="place-suggestion-empty">${escapeHtml(note || "暂时没有找到可选地址，可以加上城市名再试。")}</div>
    `;
    return;
  }

  const referenceLocation = foodState.userLocation || foodState.resolvedCenter;
  const sortedSuggestions = referenceLocation
    ? [...suggestions].sort((a, b) => {
        const distanceA = getDistanceMeters(referenceLocation, a.location) ?? Number.POSITIVE_INFINITY;
        const distanceB = getDistanceMeters(referenceLocation, b.location) ?? Number.POSITIVE_INFINITY;
        return distanceA - distanceB;
      })
    : suggestions;

  foodState.placeSuggestions = sortedSuggestions;
  foodPlaceSuggestions.hidden = false;
  foodPlaceSuggestions.innerHTML = sortedSuggestions.map((poi, index) => {
    const distance = referenceLocation ? getDistanceMeters(referenceLocation, poi.location) : null;
    const distanceLabel = formatDistanceLabel(distance);
    const meta = getPlaceSuggestionLabel(poi);

    return `
      <button class="place-suggestion-item" type="button" data-place-suggestion-index="${index}">
        <span>
          <strong>${escapeHtml(poi.name || "未命名地点")}</strong>
          <small>${escapeHtml(meta || "点击选择这个地点")}</small>
        </span>
        ${distanceLabel ? `<em>约 ${escapeHtml(distanceLabel)}</em>` : "<em>选择</em>"}
      </button>
    `;
  }).join("");
}

async function refreshPlaceSuggestions(query, shouldShowEmpty = false) {
  if (!query || query.length < 2 || /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(query)) {
    hidePlaceSuggestions();
    return [];
  }

  try {
    const AMap = await loadAmap();
    const suggestions = await searchPlaceSuggestions(AMap, query);
    renderPlaceSuggestions(suggestions, shouldShowEmpty ? "没有找到同名地点，可以加上城市或区名再试。" : "");
    return suggestions;
  } catch {
    if (shouldShowEmpty) {
      renderPlaceSuggestions([], "地点候选加载失败，请检查高德 Key、网络或白名单。");
    }
    return [];
  }
}

async function choosePlaceSuggestion(index) {
  const poi = foodState.placeSuggestions[index];
  if (!poi?.location) return;

  const displayName = getSelectedPlaceDisplay(poi) || poi.name;
  setResolvedFoodPlace(displayName, poi.location, { keepResolveButton: true });
  hidePlaceSuggestions();
  updateFoodResolveButton();
  updateFoodSearchButtonLabel();
  renderFoodMessage("定位已确认", `已经选择“${displayName}”，现在可以点击“搜索附近美食”。`);
}

async function geocodePlace(AMap, place) {
  const coordinateMatch = place.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (coordinateMatch) {
    return [Number(coordinateMatch[1]), Number(coordinateMatch[2])];
  }

  if (isSpecificPlaceName(place)) {
    try {
      return await searchPlaceLocation(AMap, place);
    } catch {
      // Continue with geocoder fallback below.
    }
  }

  try {
    return await new Promise((resolve, reject) => {
      const geocoder = new AMap.Geocoder();
      geocoder.getLocation(place, (status, result) => {
        const location = result?.geocodes?.[0]?.location;
        if (status === "complete" && location) {
          resolve(location);
        } else {
          reject(new Error(`place not found: ${status}`));
        }
      });
    });
  } catch {
    return searchPlaceLocation(AMap, place);
  }
}

function formatLocation(location) {
  const [lng, lat] = readLngLat(location);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return "";
  }

  return `${lng.toFixed(6)},${lat.toFixed(6)}`;
}

function getLocationArray(location) {
  const [lng, lat] = readLngLat(location);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null;
  }

  return [lng, lat];
}

function getDistanceMeters(from, to) {
  const fromLocation = getLocationArray(from);
  const toLocation = getLocationArray(to);

  if (!fromLocation || !toLocation) return null;

  const [fromLng, fromLat] = fromLocation;
  const [toLng, toLat] = toLocation;
  const toRad = (value) => value * Math.PI / 180;
  const earthRadius = 6371000;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;

  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatDistanceLabel(distance) {
  if (!Number.isFinite(distance)) return "";
  if (distance >= 1000) return `${(distance / 1000).toFixed(distance >= 10000 ? 0 : 1)}km`;
  return `${Math.round(distance)}m`;
}

function formatReadableAddress(regeocode, fallback = "") {
  const component = regeocode?.addressComponent || {};
  const district = typeof component.district === "string" ? component.district : "";
  const township = typeof component.township === "string" ? component.township : "";
  const neighborhood = typeof component.neighborhood?.name === "string" ? component.neighborhood.name : "";
  const building = typeof component.building?.name === "string" ? component.building.name : "";
  const street = typeof component.streetNumber?.street === "string" ? component.streetNumber.street : "";
  const streetNumber = typeof component.streetNumber?.number === "string" ? component.streetNumber.number : "";
  const shortAddress = [district, neighborhood || township, building, `${street}${streetNumber}`]
    .filter(Boolean)
    .join("");

  return shortAddress || regeocode?.formattedAddress || fallback;
}

function reverseGeocodeLocation(AMap, location, fallback = "") {
  const center = normalizeAmapCenter(AMap, location);

  return new Promise((resolve) => {
    const geocoder = new AMap.Geocoder();
    geocoder.getAddress(center, (status, result) => {
      if (status === "complete" && result?.regeocode) {
        resolve(formatReadableAddress(result.regeocode, fallback));
      } else {
        resolve(fallback || formatLocation(location));
      }
    });
  });
}

function setResolvedFoodPlace(label, location, options = {}) {
  const locationArray = getLocationArray(location);
  const displayLabel = label || formatLocation(location);

  foodState.resolvedCenter = locationArray;
  foodState.resolvedInputValue = displayLabel;
  foodState.shouldKeepResolveButton = Boolean(options.keepResolveButton);

  if (foodPlaceInput) {
    foodPlaceInput.value = displayLabel;
  }
}

function getFoodSearchTarget() {
  const typedPlace = foodPlaceInput?.value.trim() || "";

  if (foodState.resolvedCenter && typedPlace === foodState.resolvedInputValue) {
    return foodState.resolvedCenter;
  }

  return typedPlace;
}

function updateFoodResolveButton() {
  if (!foodResolveButton || !foodPlaceInput) return;

  const hasTypedPlace = foodPlaceInput.value.trim().length > 0;
  const isCoordinate = /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(foodPlaceInput.value);
  const isResolvedPlace = foodState.resolvedCenter && foodPlaceInput.value.trim() === foodState.resolvedInputValue;
  foodResolveButton.hidden = !hasTypedPlace || isCoordinate || (isResolvedPlace && !foodState.shouldKeepResolveButton);
}

function isSpecificPlaceName(place) {
  return /地铁|站|小区|花园|大厦|广场|商场|中心|科技园|公园|酒店|学校|医院|写字楼|商铺|市场|城/.test(place);
}

function compareFoodMerchants(a, b) {
  return (Number(a.distance) || 999999) - (Number(b.distance) || 999999);
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("browser geolocation unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000,
    });
  });
}

function searchNearbyPage(AMap, center, keyword, radius, pageIndex) {
  return new Promise((resolve) => {
    const searcher = new AMap.PlaceSearch({
      pageSize: 25,
      pageIndex,
      extensions: "all",
    });

    searcher.searchNearBy(keyword, center, radius, (status, result) => {
      if (status === "complete") {
        resolve(result?.poiList?.pois || []);
      } else if (status === "no_data") {
        resolve([]);
      } else {
        resolve([]);
      }
    });
  });
}

async function searchFoodMerchants(place) {
  const AMap = await loadAmap();
  const rawCenter = getLocationArray(place) || await geocodePlace(AMap, place);
  const center = normalizeAmapCenter(AMap, rawCenter);
  const keywords = getFoodKeywords().slice(0, foodState.category === "all" ? 8 : 6);
  const radius = getFoodRadius();
  const merchants = [];
  const seen = new Set();

  for (let pageIndex = 1; pageIndex <= maxFoodPagesPerKeyword; pageIndex += 1) {
    const pages = [];

    for (let index = 0; index < keywords.length; index += maxFoodKeywordBatchSize) {
      const keywordBatch = keywords.slice(index, index + maxFoodKeywordBatchSize);
      const batchPages = await Promise.all(keywordBatch.map(async (keyword) => {
        const pois = await searchNearbyPage(AMap, center, keyword, radius, pageIndex);
        return { keyword, pois };
      }));

      pages.push(...batchPages);
    }

    const hasMore = pages.some((page) => page.pois.length > 0);
    if (!hasMore) break;

    pages.forEach((page) => {
      page.pois.forEach((poi) => {
        const id = poi.id || `${poi.name}-${poi.address}`;
        if (seen.has(id)) return;

        seen.add(id);
        merchants.push({
          id,
          name: poi.name,
          address: poi.address,
          distance: poi.distance,
          cityname: poi.cityname,
          location: poi.location,
          image: poi.photos?.[0]?.url,
          summary: [poi.type, poi.address].filter(Boolean).join(" · "),
          url: createDianpingSearchUrl({ name: poi.name, cityname: poi.cityname }),
        });
      });
    });
  }

  const randomCandidatePool = pickWeightedMerchants(
    merchants,
    Math.min(maxFoodCandidates, merchants.length),
    false
  );
  foodState.candidateCount = randomCandidatePool.length;

  return pickWeightedMerchants(randomCandidatePool, maxFoodResults, true)
    .sort(compareFoodMerchants);
}

function setFoodRandomDisabled(disabled) {
  if (foodRandomButton) {
    foodRandomButton.disabled = disabled;
  }
  if (foodFloatingRandomButton) {
    foodFloatingRandomButton.disabled = disabled;
  }
}

function updateFoodFloat() {
  if (!foodFloat) return;

  const isToolsActive = document.querySelector("#tools")?.classList.contains("is-active");
  foodFloat.hidden = !(isToolsActive && window.scrollY > 520);
}

function renderFoodResults(merchants) {
  if (!foodResults || !foodCount || !foodRandomButton) return;

  foodState.merchants = merchants;
  foodCount.textContent = merchants.length
    ? `已从随机${foodState.candidateCount}家候选门店里抽出${merchants.length}家展示，再次搜索会重新随机抓取`
    : "还没有可随机的商家";
  setFoodRandomDisabled(merchants.length === 0);
  foodResults.innerHTML = merchants.length
    ? merchants.map((merchant) => renderFoodCard(merchant)).join("")
    : `<article class="food-empty-card"><strong>没有找到结果</strong><p>当前地点和筛选范围没有返回商家。可以切到“全部”、扩大到 2km，或者换一个更明确的地点再试。</p></article>`;
}

function showTab(tabName, shouldScroll = true) {
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === tabName);
  });

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  history.replaceState(null, "", `#${tabName}`);
  window.setTimeout(updateFoodFloat, 180);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("copy failed");
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => showTab(button.dataset.tab));
});

tabTargets.forEach((target) => {
  target.addEventListener("click", () => showTab(target.dataset.tabTarget));
});

externalLinkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const url = button.dataset.externalUrl;
    const opened = window.open(url, "_blank", "noopener,noreferrer");

    if (!opened) {
      window.location.href = url;
    }
  });
});

foodCategoryGroup?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;

  foodState.category = button.dataset.value;
  setSelected(foodCategoryGroup, foodState.category);
  updateFoodSearchButtonLabel();
});

foodDistanceGroup?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;

  foodState.distance = button.dataset.value;
  setSelected(foodDistanceGroup, foodState.distance);
  updateFoodSearchButtonLabel();
});

foodPlaceInput?.addEventListener("input", () => {
  if (foodPlaceInput.value.trim() !== foodState.resolvedInputValue) {
    foodState.resolvedCenter = null;
    foodState.resolvedInputValue = "";
    foodState.shouldKeepResolveButton = false;
  }

  updateFoodResolveButton();
  updateFoodSearchButtonLabel();

  window.clearTimeout(foodState.placeSuggestionTimer);
  foodState.placeSuggestionTimer = window.setTimeout(() => {
    refreshPlaceSuggestions(foodPlaceInput.value.trim());
  }, 360);
});

foodResolveButton?.addEventListener("click", async () => {
  const place = foodPlaceInput?.value.trim();
  if (!place) {
    renderFoodMessage("先输入地点", "请输入一个地铁站、小区、花园或大厦名称，再点击“搜索定位”。");
    foodPlaceInput?.focus();
    return;
  }

  foodResolveButton.disabled = true;
  foodResolveButton.textContent = "搜索中";
  renderFoodMessage("正在搜索定位", "正在查找同名地点。如果出现多个候选，请先选择你想看的地址。");

  try {
    const AMap = await loadAmap();
    const suggestions = await refreshPlaceSuggestions(place, true);

    if (suggestions.length > 1) {
      renderFoodMessage("请选择地址", "下面列出了几个同名或相似地点，优先显示离你更近的地址。");
      return;
    }

    if (suggestions.length === 1) {
      await choosePlaceSuggestion(0);
      return;
    }

    const location = await geocodePlace(AMap, place);
    const formattedLocation = formatLocation(location);

    if (!formattedLocation) {
      throw new Error("location parse failed");
    }

    const readableAddress = await reverseGeocodeLocation(AMap, location, place);
    setResolvedFoodPlace(readableAddress, location);
    updateFoodResolveButton();
    updateFoodSearchButtonLabel();
    renderFoodMessage("定位已确认", `已经识别到“${readableAddress}”，现在可以点击“搜索附近美食”。`);
  } catch {
    renderFoodMessage("搜索定位失败", "这个地点没有识别成功。可以试试加上城市名，例如：深圳 后海地铁站、深圳 某某花园。");
  } finally {
    foodResolveButton.disabled = false;
    foodResolveButton.textContent = "搜索定位";
  }
});

foodLocateButton?.addEventListener("click", async () => {
  foodLocateButton.disabled = true;
  foodLocateButton.textContent = "定位中";
  renderFoodMessage("正在实时定位", "请在浏览器弹窗里允许定位权限。定位成功后会自动填入当前位置。");

  try {
    const position = await getCurrentPosition();
    const { longitude, latitude } = position.coords;
    const location = [longitude, latitude];
    const AMap = await loadAmap();
    foodState.userLocation = location;
    const readableAddress = await reverseGeocodeLocation(AMap, location, "当前位置");
    setResolvedFoodPlace(readableAddress, location);
    hidePlaceSuggestions();
    updateFoodResolveButton();
    updateFoodSearchButtonLabel();
    renderFoodMessage("定位成功", `已经定位到“${readableAddress}”，可以直接点击“搜索附近美食”。`);
  } catch {
    renderFoodMessage("定位失败", "没有成功获取当前位置。请确认浏览器允许定位，并尽量在线上 HTTPS 网址中使用。");
  } finally {
    foodLocateButton.disabled = false;
    foodLocateButton.textContent = "实时定位";
  }
});

foodPlaceSuggestions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-place-suggestion-index]");
  if (!button) return;

  choosePlaceSuggestion(Number(button.dataset.placeSuggestionIndex));
});

foodSearchButton?.addEventListener("click", async () => {
  const place = foodPlaceInput?.value.trim();

  if (!place) {
    renderFoodMessage("先输入地点", "默认不自动搜索。请输入一个地点，比如：深圳南山区、广州天河城、上海静安寺。");
    foodPlaceInput?.focus();
    return;
  }

  if (!amapConfig.key) {
    foodState.merchants = [];
    renderFoodMessage(
      "等待配置高德 Key",
      `已记录地点：${place}。下一步配置高德 JS API Key 后，会按当前分类和距离抓取真实周边美食。`
    );
    return;
  }

  renderFoodMessage("正在搜索", "正在根据地点、分类和距离抓取周边美食。通常需要 5-20 秒，商家较多时可能接近 30 秒。");

  try {
    const merchants = await searchFoodMerchants(getFoodSearchTarget());
    foodState.lastSearchKey = getFoodSearchKey();
    renderFoodResults(merchants);
    updateFoodSearchButtonLabel();
  } catch (error) {
    foodState.merchants = [];
    const reason = error?.message || "unknown error";
    renderFoodMessage(
      "搜索失败",
      `没有成功获取商家数据。原因：${reason}。如果你在本地 file 页面测试，请上传到 Netlify 后，并在高德后台把 Netlify 域名加入 JS API Key 的安全白名单。`
    );
  }
});

foodRandomButton?.addEventListener("click", openRandomFood);
foodRandomAgainButton?.addEventListener("click", openRandomFood);
foodFloatingRandomButton?.addEventListener("click", openRandomFood);

foodBackTopButton?.addEventListener("click", () => {
  document.querySelector("#tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("scroll", updateFoodFloat, { passive: true });

foodOverlay?.addEventListener("click", (event) => {
  if (event.target === foodOverlay) {
    foodOverlay.hidden = true;
  }
});

sheetDistricts?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sheet-district]");
  if (!button) return;

  sheetFoodState.district = button.dataset.sheetDistrict;
  renderSheetDistricts();
  renderSheetFoodLibrary();
});

sheetRandomButton?.addEventListener("click", openRandomSheetFood);
sheetRandomAgainButton?.addEventListener("click", openRandomSheetFood);

sheetOverlay?.addEventListener("click", (event) => {
  if (event.target === sheetOverlay) {
    sheetOverlay.hidden = true;
  }
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const overlay = button.closest(".contact-overlay, .quest-overlay, .food-overlay");
    if (overlay) {
      overlay.hidden = true;
    }
  });
});

contactOpen?.addEventListener("click", (event) => {
  event.stopPropagation();
  copyButtons.forEach((button) => {
    button.textContent = copyLabel;
  });
  contactOverlay.hidden = false;
});

contactOverlay?.addEventListener("click", (event) => {
  if (event.target === contactOverlay) {
    contactOverlay.hidden = true;
  }
});

questButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const questId = button.dataset.questOpen;
    const template = document.querySelector(`#quest-template-${questId}`);

    if (!template || !questOverlay || !questTitle || !questBody) {
      return;
    }

    questTitle.textContent = questTitles[questId] || "";
    questBody.innerHTML = "";
    questBody.append(template.content.cloneNode(true));
    questOverlay.hidden = false;
  });
});

questOverlay?.addEventListener("click", (event) => {
  if (event.target === questOverlay) {
    questOverlay.hidden = true;
  }
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.stopPropagation();
    const value = button.dataset.copyValue;

    try {
      await copyText(value);
      button.textContent = copiedLabel;
      window.setTimeout(() => {
        button.textContent = copyLabel;
      }, 1400);
    } catch {
      button.textContent = failedLabel;
      window.prompt("\u8bf7\u624b\u52a8\u590d\u5236", value);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactOverlay && !contactOverlay.hidden) {
    contactOverlay.hidden = true;
  }
  if (event.key === "Escape" && questOverlay && !questOverlay.hidden) {
    questOverlay.hidden = true;
  }
  if (event.key === "Escape" && foodOverlay && !foodOverlay.hidden) {
    foodOverlay.hidden = true;
  }
  if (event.key === "Escape" && sheetOverlay && !sheetOverlay.hidden) {
    sheetOverlay.hidden = true;
  }
});

const initialTab = location.hash.replace("#", "");
if (buttons.some((button) => button.dataset.tab === initialTab)) {
  showTab(initialTab, false);
} else if (initialTab === "resume") {
  showTab("home", false);
} else if (initialTab) {
  showTab("home", false);
}

updateFoodResolveButton();
updateFoodSearchButtonLabel();
updateFoodFloat();
renderSheetDistricts();
renderSheetFoodLibrary();
loadSheetFoodData();
