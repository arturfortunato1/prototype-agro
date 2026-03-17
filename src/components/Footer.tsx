import { footerColumns } from '../data/content';
import { assetUrl } from '../utils';

export function Footer() {
  return (
    <footer id="footer" className="border-t border-syngenta-deep/10 bg-white py-14">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 md:px-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <img src={assetUrl('images/logo/Logo-novo.png')} alt="AgroTech" className="h-11 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-syngenta-deep/72">
            Tecnologia agrícola global com foco em ciência, produtividade e sustentabilidade para o campo brasileiro.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-syngenta-blue/70">AgroTech Brasil</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-syngenta-blue/70">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-syngenta-deep/82 transition hover:text-syngenta-blue">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1400px] flex-col gap-3 border-t border-syngenta-deep/10 px-6 pt-6 text-xs text-syngenta-deep/58 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} AgroTech Brasil. Todos os direitos reservados.</p>
        <div className="flex gap-5">
          <a href="#" className="hover:text-syngenta-blue">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-syngenta-blue">
            Termos de Uso
          </a>
        </div>
      </div>
    </footer>
  );
}
