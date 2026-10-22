Chart slide: graphic on the left, 结论 + 先改这件 on the right. Pass a data component as `chart`.

```jsx
<ChartSlide chartTitle="渗透率矩阵" chart={<Matrix2x2 height={380} {...m} />}
  takeaway="招牌菜渗透高、毛利稳；两道菜拖低整体毛利。" action="重排午市套餐结构" page={6} />
```

Wraps `SlideFrame` (1280×720, footer seal, page number) — pass `page` so the deck numbers
itself. All slide text sits at 19px+ so it stays readable projected; never shrink below that.
