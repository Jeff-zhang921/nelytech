"use client";

import { useEffect } from "react";

type ScrollLockState = {
  scrollX: number;
  scrollY: number;
  bodyOverflow: string;
  bodyOverscrollBehavior: string;
  bodyPaddingRight: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  documentOverflow: string;
  documentOverscrollBehavior: string;
  documentScrollBehavior: string;
  documentScrollBehaviorPriority: string;
  documentLockAttribute: string | null;
};

let activeLocks = 0;
let scrollLockState: ScrollLockState | null = null;
let pendingUnlockFrame: number | null = null;

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    return acquireBodyScrollLock();
  }, [isLocked]);
}

function acquireBodyScrollLock() {
  let released = false;

  if (pendingUnlockFrame !== null) {
    window.cancelAnimationFrame(pendingUnlockFrame);
    pendingUnlockFrame = null;
  }

  activeLocks += 1;

  if (activeLocks === 1 && scrollLockState === null) {
    const body = document.body;
    const root = document.documentElement;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const bodyPaddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;

    scrollLockState = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyPaddingRight: body.style.paddingRight,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      documentOverflow: root.style.overflow,
      documentOverscrollBehavior: root.style.overscrollBehavior,
      documentScrollBehavior: root.style.scrollBehavior,
      documentScrollBehaviorPriority: root.style.getPropertyPriority("scroll-behavior"),
      documentLockAttribute: root.getAttribute("data-scroll-locked"),
    };

    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    root.setAttribute("data-scroll-locked", "true");
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollLockState.scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    }
  }

  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks !== 0 || !scrollLockState || pendingUnlockFrame !== null) return;

    pendingUnlockFrame = window.requestAnimationFrame(() => {
      pendingUnlockFrame = null;

      if (activeLocks !== 0 || !scrollLockState) return;
      restoreBodyScroll();
    });
  };
}

function restoreBodyScroll() {
  if (!scrollLockState) return;

  const body = document.body;
  const root = document.documentElement;
  const savedState = scrollLockState;
  scrollLockState = null;

  body.style.overflow = savedState.bodyOverflow;
  body.style.overscrollBehavior = savedState.bodyOverscrollBehavior;
  body.style.paddingRight = savedState.bodyPaddingRight;
  body.style.position = savedState.bodyPosition;
  body.style.top = savedState.bodyTop;
  body.style.left = savedState.bodyLeft;
  body.style.right = savedState.bodyRight;
  body.style.width = savedState.bodyWidth;
  root.style.overflow = savedState.documentOverflow;
  root.style.overscrollBehavior = savedState.documentOverscrollBehavior;

  if (savedState.documentLockAttribute === null) {
    root.removeAttribute("data-scroll-locked");
  } else {
    root.setAttribute("data-scroll-locked", savedState.documentLockAttribute);
  }

  root.style.setProperty("scroll-behavior", "auto", "important");
  void getComputedStyle(root).scrollBehavior;
  window.scrollTo({
    behavior: "auto",
    left: savedState.scrollX,
    top: savedState.scrollY,
  });

  if (savedState.documentScrollBehavior) {
    root.style.setProperty(
      "scroll-behavior",
      savedState.documentScrollBehavior,
      savedState.documentScrollBehaviorPriority,
    );
  } else {
    root.style.removeProperty("scroll-behavior");
  }
}
