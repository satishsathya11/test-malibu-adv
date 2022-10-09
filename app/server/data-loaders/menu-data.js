import get from "lodash/get";
import find from "lodash/find";

exports.getNavigationMenuArray = function(menuList = [], sectionList) {
  menuList.forEach(menuItem => {
    menuItem.children = menuList.filter(item => item["parent-id"] === menuItem.id);
    switch (menuItem["item-type"]) {
      case "tag":
        menuItem.completeUrl = menuItem["tag-slug"] ? `/topic/${menuItem["tag-slug"]}` : "/#";
        break;
      case "link":
        menuItem.completeUrl = get(menuItem, ["data", "link"]) || "/#";
        menuItem.isExternalLink = true;
        break;
      case "section":
        menuItem.completeUrl = findCompleteUrl(menuItem, sectionList);
        break;
      default:
        menuItem.completeUrl = "/#";
        break;
    }
  });
  const menu = menuList.filter(item => item["parent-id"] == null);

  return {
    footer: menu.filter(item => item["menu-group-slug"] === "footer"),
    default: menu.filter(item => item["menu-group-slug"] === "default"),
    homeMenu: menu.filter(item => item["menu-group-slug"] === "home"),
    hamburgerMenu: menu.filter(item => item["menu-group-slug"] === "hamburger")
  };
};

function findCompleteUrl(menuItem, sectionList) {
  const sectionObject = find(sectionList, function(item) {
    return item.id === menuItem["item-id"];
  });
  if (!sectionObject) {
    return "/#";
  }
  if (sectionObject["parent-id"]) {
    const parentSectionObj = find(sectionList, function(item) {
      return sectionObject["parent-id"] === item.id;
    });
    return parentSectionObj ? `/${parentSectionObj.slug}/${sectionObject.slug}` : "/#";
  }
  return "/" + sectionObject.slug || "/#";
}
