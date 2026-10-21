专家顾问团 roster — circular portrait, name, one-line 头衔, 专长. Portraits fall back to a labelled placeholder.

```jsx
<ExpertTeamSlide experts={[{ name: "王明", title: "淮扬菜出品顾问", field: "菜品结构 · 出餐标准", photo: "../assets/experts/wang.jpg" }]} page={9} />
```

Wraps `SlideFrame` (1280×720, footer seal, page number) — pass `page` so the deck numbers
itself. All slide text sits at 19px+ so it stays readable projected; never shrink below that.
