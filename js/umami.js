// 从配置文件中获取 umami 的配置
const website_id = CONFIG.statistics.umami.data_website_id;

// 拼接请求地址
const request_url =
  CONFIG.statistics.umami.api_server +
  "/api/websites/" +
  website_id +
  "/stats";

const start_time = new Date(CONFIG.statistics.umami.start_time).getTime(); // 转换为 Unix 时间戳
const end_time = new Date().getTime();

const token = CONFIG.statistics.umami.token;

// 检查配置是否为空
if (!website_id) {
    throw new Error("Umami website_id is empty");
}
if (!request_url) {
    throw new Error("Umami request_url is empty");
}
if (!start_time) {
    throw new Error("Umami start_time is empty");
}
if (!token) {
    throw new Error("Umami token is empty");
}

const params = new URLSearchParams({
    startAt: start_time,
    endAt: end_time,
});

const request_header = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
    },
};

async function siteStats() {
  try {
    const response = await fetch(`${request_url}?${params}`, request_header);
    const data = await response.json();

    const totalTraffic = data.pageviews.value; // 获取总访问量
    const uniqueVisitors = data.visitors.value; // 获取独立访客数

    let pvCtn = document.querySelector("#busuanzi_container_site_pv");
    if (pvCtn) {
      let ele = document.querySelector("#busuanzi_value_site_pv");
      if (ele) {
        ele.textContent = totalTraffic; // 设置总访问量
        pvCtn.style.display = "inline-block"; // 将元素显示出来
        document.getElementById("busuanzi_loading_icon_site_pv").style.display = "none"; // 移除动态图标
      }
    }

    let uvCtn = document.querySelector("#busuanzi_container_site_uv");
    if (uvCtn) {
      let ele = document.querySelector("#busuanzi_value_site_uv");
      if (ele) {
        ele.textContent = uniqueVisitors;
        uvCtn.style.display = "inline-block";
        document.getElementById("busuanzi_loading_icon_site_uv").style.display = "none"; // 移除动态图标
      }
    }

    // console.log(uniqueVisitors, pageViews);
    // console.log(data);
  } catch (error) {
    console.error(error);
    return "-1";
  }
}

async function pageStats(path) {
  // console.log(path);
  try {
    const response = await fetch(`${request_url}?${params}&url=${path}`, request_header);
    const data = await response.json();
    const pageViews = data.pageviews.value;

    // console.log(data)

    let viewCtn = document.querySelector("#umami-page-views-container");
    if (viewCtn) {
      let ele = document.querySelector("#umami-page-views");
      if (ele) {
        ele.textContent = pageViews;
        viewCtn.style.display = "inline";
        document.getElementById("umami-page-views").style.display = "inline-block";
        document.getElementById("umami_pageviews_loading_icon").style.display = "none";
      }
    }
  } catch (error) {
    console.error(error);
    return "-1";
  }
}

siteStats();

let viewCtn = document.querySelector("#umami-page-views-container");
if (viewCtn) {
  let path = window.location.pathname.replace(/\/$/,'') + '/';
  let target = decodeURI(path.replace(/\/*(index.html)?$/, "/"));
  pageStats(target);
}
