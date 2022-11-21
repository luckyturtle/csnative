import { set } from 'lodash';

export const adaptFormToRtl = (stylesheet) => {
  let align = '';
  Object.keys(stylesheet).forEach((key) => {
    align = 'right';
    if (key === 'controlLabel' || key === 'helpBlock') {
      align = 'left';
    }

    if (stylesheet[key].normal) {
      set(stylesheet, `${key}.normal.textAlign`, align);
      set(stylesheet, `${key}.normal.writingDirection`, 'rtl');
    }

    if (stylesheet[key].error) {
      set(stylesheet, `${key}.error.textAlign`, align);
      set(stylesheet, `${key}.error.writingDirection`, 'rtl');
    }

    if (stylesheet[key].notEditable) {
      set(stylesheet, `${key}.notEditable.textAlign`, align);
      set(stylesheet, `${key}.notEditable.writingDirection`, 'rtl');
    }

    set(stylesheet, `${key}.textAlign`, align);
    set(stylesheet, `${key}.writingDirection`, 'rtl');
  });

  return stylesheet;
};
