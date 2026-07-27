import React from 'react';

const LAST_UPDATED = '27 de julio de 2026';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
        Política de Privacidad
      </h1>
      <p className="text-neutral-500 mb-10">Última actualización: {LAST_UPDATED}</p>

      <div className="space-y-8 text-neutral-700 leading-relaxed">
        <section>
          <p>
            Esta Política de Privacidad aplica al sitio web de Bobiare (
            <span className="font-mono text-sm">bobiare.n7softwares.com</span>) y a la aplicación
            móvil de Bobiare (Android/iOS), que ofrecen el mismo servicio bajo la misma cuenta de
            usuario — la app no tiene panel de administración, pero el tratamiento de datos
            personales de clientes es idéntico en ambas plataformas. Al usar el sitio o la app,
            aceptás las prácticas descriptas acá.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            1. Responsable del tratamiento
          </h2>
          <p>
            Bobiare S.A. es responsable del tratamiento de los datos personales que recopilamos a
            través del sitio web y la aplicación móvil. Para cualquier consulta sobre esta
            política o el tratamiento de tus datos, podés escribirnos a{' '}
            <a href="mailto:info@bobiaresa.com.ar" className="text-primary-600 hover:underline">
              info@bobiaresa.com.ar
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            2. Qué datos recopilamos
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Datos de cuenta:</strong> nombre y dirección de correo electrónico al
              registrarte. La contraseña se almacena siempre encriptada (hash), nunca en texto
              plano.
            </li>
            <li>
              <strong>Datos de pedidos y envío:</strong> los productos/servicios solicitados,
              dirección de envío, y el número de seguimiento cuando enviás tu pieza por Correo
              Argentino.
            </li>
            <li>
              <strong>Datos de pago:</strong> mientras no tengamos una pasarela de pago
              electrónico integrada, los pagos se registran manualmente por nuestro equipo (por
              ejemplo, al confirmar una transferencia) — no recopilamos ni almacenamos números de
              tarjeta de crédito/débito en nuestros sistemas.
            </li>
            <li>
              <strong>Fotos de piezas:</strong> si usás el identificador de piezas con inteligencia
              artificial, la foto que subís se envía a un proveedor externo de IA para analizarla
              (ver sección 4). No usamos esas fotos para ningún otro fin ni las publicamos.
            </li>
            <li>
              <strong>Datos técnicos:</strong> un token de sesión (para mantenerte logueado) y,
              si navegás sin cuenta, un token de invitado para identificar tu carrito de compras.
              Se guardan en el almacenamiento local de tu navegador o dispositivo, no en cookies
              de terceros con fines publicitarios.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            3. Para qué usamos tus datos
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gestionar tu cuenta, tus pedidos y el estado de tus envíos.</li>
            <li>Comunicarnos con vos sobre el estado de tu pedido o pieza en reparación.</li>
            <li>
              Identificar el tipo de pieza y sugerir el servicio de restauración adecuado, cuando
              usás el identificador con IA.
            </li>
            <li>Mejorar nuestros productos, servicios y la experiencia del sitio/app.</li>
            <li>Cumplir obligaciones legales, contables o impositivas.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            4. Con quién compartimos tus datos
          </h2>
          <p className="mb-3">
            No vendemos tus datos personales. Los compartimos únicamente con proveedores que nos
            ayudan a operar el servicio, bajo sus propias políticas de privacidad y solo para el
            fin que se describe:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Supabase</strong> — aloja nuestra base de datos y las imágenes de productos.
            </li>
            <li>
              <strong>Anthropic (Claude) y/o Google (Gemini)</strong> — cuando usás el
              identificador de piezas con IA, la foto que subís se procesa a través de uno de
              estos proveedores para generar el análisis. Solo se envía la imagen y el catálogo de
              servicios necesario para la sugerencia, no el resto de tus datos de cuenta.
            </li>
            <li>
              <strong>Correo Argentino</strong> — para la logística de envío de tu pieza (de ida y
              de vuelta).
            </li>
            <li>
              <strong>Pasarela de pago</strong> — cuando integremos un medio de pago electrónico
              (por ejemplo Mercado Pago), esta política se va a actualizar antes de que eso entre
              en funcionamiento.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            5. Cuánto tiempo conservamos tus datos
          </h2>
          <p>
            Conservamos tus datos mientras tengas una cuenta activa y, después de eso, durante el
            plazo necesario para cumplir obligaciones legales o impositivas (por ejemplo,
            registros de facturación). Podés solicitar la eliminación de tu cuenta en cualquier
            momento (ver sección 7).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            6. Seguridad
          </h2>
          <p>
            Las contraseñas se almacenan encriptadas, las comunicaciones entre tu dispositivo y
            nuestros servidores viajan cifradas (HTTPS), y el acceso a datos administrativos está
            restringido por rol dentro de nuestro equipo.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            7. Tus derechos
          </h2>
          <p>
            De acuerdo con la Ley 25.326 de Protección de Datos Personales de Argentina, tenés
            derecho a acceder, rectificar, actualizar o solicitar la supresión de tus datos
            personales. Para ejercer estos derechos, escribinos a{' '}
            <a href="mailto:info@bobiaresa.com.ar" className="text-primary-600 hover:underline">
              info@bobiaresa.com.ar
            </a>
            . La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control
            de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que se
            interpongan con relación al incumplimiento de las normas sobre protección de datos
            personales.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            8. Menores de edad
          </h2>
          <p>
            Nuestros servicios están dirigidos a mayores de 18 años. No recopilamos
            intencionalmente datos de menores de edad.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            9. Permisos en la aplicación móvil
          </h2>
          <p>
            La app solicita acceso a tu cámara o galería de fotos únicamente cuando elegís subir
            una imagen (por ejemplo, para el identificador de piezas con IA). No accedemos a tus
            fotos fuera de ese momento ni sin tu acción explícita.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            10. Cambios a esta política
          </h2>
          <p>
            Podemos actualizar esta política cuando cambien nuestros servicios o la normativa
            aplicable. Vamos a publicar cualquier cambio en esta misma página junto con la fecha
            de actualización.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-3">
            11. Contacto
          </h2>
          <p>
            Ante cualquier duda sobre esta política o el tratamiento de tus datos, escribinos a{' '}
            <a href="mailto:info@bobiaresa.com.ar" className="text-primary-600 hover:underline">
              info@bobiaresa.com.ar
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
