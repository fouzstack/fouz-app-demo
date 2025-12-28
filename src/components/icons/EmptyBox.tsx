export default function EmptyBoxIcon({ size = 100 }) {
  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      imageRendering='optimizeQuality'
      fillRule='evenodd'
      clipRule='evenodd'
    >
      <path d='m92 25v57l-33 17-50-17 1-57 49 11z' fill='#222' stroke='#888' />
      <path
        d='m10 25-9-15 37-6 9 14 6-15 45 5-6 17-33 11z'
        fill='#888'
        stroke='#222'
      />
      <path d='m10 25 37-7 45 7-33 11z' fill='#333' stroke='#222' />
      <path d='m59 38v59' fill='none' stroke='#444' strokeWidth='1.5' />
      <path d='m23 80 20 7v-23l-20-7zm20-18c0-20-20-30-20-7z' fill='#9c0' />
      <path
        d='m19 60v12m28-3v12m-19-1v5m10-1.5v5'
        fill='none'
        stroke='#9c0'
        strokeLinecap='round'
        strokeWidth='5'
      />
      <path d='m28 51a1 2 0 1 1 0 .1zm8 2.5a1 2 0 1 1 0 .1z' fill='#222' />
      <path d='m1 41 9-16 49 11 33-11 7 17-33 13-7-19-8 20z' fill='#666' />
    </svg>
  );
}
