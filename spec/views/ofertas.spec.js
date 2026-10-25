import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Ofertas from '../../src/views/Ofertas.jsx';

describe('vista de ofertas', () => {
  it('muestra productos en oferta con precio rebajado y acceso al detalle', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(Ofertas))
    );

    expect(html).toContain('Porción de pastel de choclo');
    expect(html).toContain('7.500');
    expect(html).toContain('Ver producto');
    expect(html).toContain('/producto/PR001');
  });
});
