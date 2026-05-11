type SelectRowIconProps = {
  style?: object;
};

export default function SelectArrowIcon({ style }: SelectRowIconProps) {
  return (
    <span style={style}>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.529247 0.528758C0.789596 0.268409 1.21171 0.268409 1.47206 0.528758L5.00065 4.05735L8.52925 0.528758C8.7896 0.268409 9.21171 0.268409 9.47205 0.528758C9.7324 0.789108 9.7324 1.21122 9.47205 1.47157L5.47205 5.47157C5.21171 5.73192 4.7896 5.73192 4.52925 5.47157L0.529247 1.47157C0.268897 1.21122 0.268897 0.789108 0.529247 0.528758Z"
          fill="#1D1E20"
        />
      </svg>
    </span>
  );
}
