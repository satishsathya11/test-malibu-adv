import { getCriticalCss } from "./render-layout";

const mock = `.app-logo-m__publisher-logo__3FL5U {
  height: 66px;
  max-width: 100%;
}

.top-bar-m__main-wrapper__3R2rG {
  position: relative;
  padding: 10px 0;

}


.menu-item-m__menu-link__1QLDO {
  padding: 14px 6px 14px 6px;
  display: flex;
  align-items: center;
  color: var(--brand-secondary);
}

.menu-item-m__menu-link__1QLDO:hover {
  color: var(--rgb-black);
}

.menu-item-m__arrow-down__3WRVq {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid var(--brand-secondary);
  margin: 4px 4px 0;
  cursor: pointer;
}

.hamburger-menu-m__hamburger__2e-Oz {
  background-color: transparent;
  border: 0;
  box-shadow: none;
  cursor: pointer;
  padding: 0;
  margin: 12px 0;
}

.hamburger-menu-m__hamburger__2e-Oz:focus {
  outline: none;
}

.hamburger-menu-m__line__2frlK {
  background-color: var(--brand-secondary);
  display: block;
  height: 3px;
  width: 22px;
  transition: all 0.1s ease-in;
  border-radius: 2px;
}

.hamburger-menu-m__line__2frlK:nth-child(2) {
  margin: 4px 0;
}

.hamburger-menu-m__hamburger__2e-Oz.hamburger-menu-m__is-open__2kiOc span:nth-child(1) {
  transform: translateY(4px) rotate(45deg);
}

.hamburger-menu-m__hamburger__2e-Oz.hamburger-menu-m__is-open__2kiOc span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu-m__hamburger__2e-Oz.hamburger-menu-m__is-open__2kiOc span:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

.navbar-m__navbar__317DW {
  list-style-type: none;
  margin: 0 12px;
  display: flex;
  overflow: auto;
  font-family: var(--title-font);
}

.navbar-m__main-wrapper__32qkZ {
  background-color: var(--brand-primary);
  position: relative;
  box-shadow: -1px 12px 13px -11px rgba(var(--rgb-black), 0.42);
  margin-bottom: 16px;
}

.navbar-m__wrapper__1TYur {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  position: relative;
}

.navbar-m__toggle-btn__1XvcJ {
  position: relative;
}

.navbar-m__dropdown__38mBO {
  display: flex;
  line-height: 0;
  flex-shrink: 0;
  align-items: center;
  margin-right: 8px;
}

.navbar-m__dropdown-content__19wFA {
  position: absolute;
  background-color: var(--white);
  min-width: 220px;
  box-shadow: 0px 8px 16px 0px rgba(var(--rgb-black), 0.2);
  padding: 12px 16px;
  z-index: var( --zlevel2);
  top: 0;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: scroll;
}

.navbar-m__dropdown-content__19wFA .hamburger-menu {
    align-self: flex-end;
  }

.navbar-m__dropdown-content__19wFA .menu-link {
    padding: 16px 0;
    margin-bottom: 12px;
    width: 100%;
  }

.navbar-m__dropdown-content__19wFA .menu-link:last-child {
    margin-bottom: 0px;
  }

.navbar-m__dropdown-content__19wFA .menu-link:hover {
    color: var(--brand-primary-dark);
  }

.navbar-m__dropdown-menu__37mo1 {
  padding: 12px;
}

.navbar-m__navbar__317DW::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  z-index: var(--zlevel3);
}

.navbar-m__navbar__317DW::-webkit-scrollbar-thumb {
  background: var(--brand-primary);
  border-radius: 0px;
}

.navbar-m__overlay__2TAe1 {
  left: 0;
  right: 0;
  background-color: var(--brand-secondary);
  width: 100vw;
  height: 100vh;
  top: 0;
  position: fixed;
  z-index: var(--zlevel1);
  opacity: 0.4;
}

.navbar-m__user-profile___Ur1O {
  flex-shrink: 0;
}

.navbar-m__user-btn__G_nap {
  background-color: transparent;
  border: none;
  padding: 0;
}

.navbar-m__member-img__1RYjH {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  cursor: pointer;
  -o-object-fit: cover;
     object-fit: cover;
}

.navbar-m__user-account__3Fy8- {
  right: 0;
  top: 42px;
  margin-right: 16px;
}

.navbar-m__user-account-item__2keQX {
  cursor: pointer;
  padding: 8px 0;
}

.navbar-m__user-account-item__2keQX:hover {
  color: var(--brand-primary-dark);
}`;

test("Extract critical css", () => {
  return getCriticalCss().then(data => {
    expect(mock).toEqual(data.trim());
  });
});
