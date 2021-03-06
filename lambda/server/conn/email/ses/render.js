const { root } = require('../../../config/environment/index');

const fs = require('fs');
const hbs = require('handlebars');

module.exports = ({
  TemplateName, afterContent = [], extras = [],
}) => {
  const [layout, template] = TemplateName.split('_');
  const layoutBase = `${root}/server/emails/${layout}`;
  const layoutHTML = fs.readFileSync(`${layoutBase}/${layout}.hbs`).toString();
  const params = {
    template: fs.readFileSync(`${layoutBase}/${template}/${template}.hbs`).toString(),
  };

  extras.forEach((part) => {
    let piece = part;
    let partPath = `${layoutBase}/${template}/${part}.hbs`;
    if (part.includes(':')) {
      const [type, currentPiece] = part.split(':');
      const path = type === 'global' ? 'partials' : layout;
      piece = currentPiece;
      partPath = `${root}/server/emails/${path}/${currentPiece}.hbs`;
    }

    params[piece] = fs
      .readFileSync(partPath)
      .toString();
  });

  if (afterContent.length) {
    params.afterContent = afterContent
      .map((part) => {
        let partPath = `${layoutBase}/${template}/${part}.hbs`;
        if (part.includes(':')) {
          const [type, piece] = part.split(':');
          const path = type === 'global' ? 'partials' : layout;
          partPath = `${root}/server/emails/${path}/${piece}.hbs`;
        }

        return fs
          .readFileSync(partPath)
          .toString();
      }).join('');
  }

  return hbs.compile(layoutHTML)(params).replace('<!--ad-->', '{{{ad}}}');
};
