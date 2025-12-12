import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";

export default function TermsModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="md" fullWidth>
      <DialogTitle>Términos y Condiciones</DialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>
          <strong>Fecha de última actualización:</strong> [poner fecha]
        </Typography>

        <Typography gutterBottom>
          Bienvenido/a a <strong>Motion Crush</strong> (“la Aplicación”,
          “el Servicio”, “nosotros” o “nuestro”). Al acceder o utilizar la
          Aplicación, usted (“el Usuario”) acepta estos Términos y Condiciones
          de Uso. Si no está de acuerdo con alguno de ellos, no debe utilizar el
          Servicio. Estos Términos se rigen por las leyes de la República
          Argentina.
        </Typography>

        {/* 1 */}
        <Typography variant="h6" gutterBottom>
          1. Aceptación de los Términos
        </Typography>
        <Typography gutterBottom>
          Al crear una cuenta, acceder o utilizar la Aplicación, el Usuario
          declara haber leído y comprendido estos Términos, y acepta quedar
          legalmente obligado por ellos.
        </Typography>

        {/* 2 */}
        <Typography variant="h6" gutterBottom>
          2. Requisitos de uso
        </Typography>
        <Typography gutterBottom>
          Para utilizar el Servicio, el Usuario debe:
        </Typography>
        <Typography component="div" gutterBottom>
          • Tener al menos 18 años o contar con autorización de un adulto
          responsable. <br />
          • Proporcionar información verdadera, precisa y completa al
          registrarse. <br />
          • Mantener la confidencialidad de sus credenciales de acceso.
        </Typography>
        <Typography gutterBottom>
          El Usuario es responsable por toda actividad realizada desde su
          cuenta.
        </Typography>

        {/* 3 */}
        <Typography variant="h6" gutterBottom>
          3. Creación de cuentas
        </Typography>
        <Typography gutterBottom>
          El Usuario puede crear una cuenta dentro de la Aplicación. Nos
          reservamos el derecho de rechazar o cancelar una cuenta en caso de
          incumplimiento de estos Términos o por uso indebido del Servicio.
        </Typography>

        {/* 4 */}
        <Typography variant="h6" gutterBottom>
          4. Contenido generado por el Usuario
        </Typography>
        <Typography gutterBottom>
          Los Usuarios pueden crear y/o subir contenido, incluyendo textos,
          imágenes u otros materiales. El Usuario declara y garantiza que posee
          los derechos necesarios sobre dicho contenido y que el mismo no
          infringe derechos de terceros. Está prohibido subir contenido ilegal,
          ofensivo, discriminatorio o que viole leyes vigentes.
        </Typography>
        <Typography gutterBottom>
          El Usuario otorga a <strong>Motion Crush</strong> una licencia
          no exclusiva, mundial, gratuita, transferible y sublicenciable para
          usar, reproducir, distribuir, modificar y mostrar dicho contenido
          únicamente con el fin de operar y mejorar el Servicio.
        </Typography>
        <Typography gutterBottom>
          Nos reservamos el derecho de eliminar contenido inapropiado o que
          viole estos Términos.
        </Typography>

        {/* 5 */}
        <Typography variant="h6" gutterBottom>
          5. Suscripciones y pagos
        </Typography>
        <Typography gutterBottom>
          La Aplicación ofrece planes de suscripción pagos que brindan acceso a
          funciones adicionales.
        </Typography>

        <Typography gutterBottom>
          <strong>5.1. Facturación:</strong> Los cargos se procesan según el
          plan seleccionado. Los precios pueden actualizarse y se notificará al
          Usuario. Los montos se expresan en pesos argentinos (ARS), salvo
          indicación contraria.
        </Typography>

        <Typography gutterBottom>
          <strong>5.2. Renovación automática:</strong> Las suscripciones se
          renuevan automáticamente salvo cancelación previa.
        </Typography>

        <Typography gutterBottom>
          <strong>5.3. Cancelación:</strong> El Usuario puede cancelar en
          cualquier momento desde su cuenta. La cancelación no implica
          reembolsos de períodos ya facturados salvo disposición legal aplicable.
        </Typography>

        {/* 6 */}
        <Typography variant="h6" gutterBottom>
          6. Prueba gratuita
        </Typography>
        <Typography gutterBottom>
          Podemos ofrecer una prueba gratuita del Servicio. Podremos limitar o
          cancelar la prueba en caso de abuso o uso indebido.
        </Typography>

        {/* 7 */}
        <Typography variant="h6" gutterBottom>
          7. Propiedad intelectual
        </Typography>
        <Typography gutterBottom>
          Todo el contenido de <strong>Motion Crush</strong>, incluyendo
          diseño, código, textos, imágenes, logotipos y marca, es propiedad
          exclusiva de sus titulares. Está prohibido copiar, modificar o
          distribuir dicho contenido sin autorización.
        </Typography>

        {/* 8 */}
        <Typography variant="h6" gutterBottom>
          8. Comentarios y sugerencias
        </Typography>
        <Typography gutterBottom>
          Si el Usuario envía sugerencias, ideas o comentarios, reconoce que
          podremos utilizarlos sin obligación de compensación, crédito o
          reconocimiento.
        </Typography>

        {/* 9 */}
        <Typography variant="h6" gutterBottom>
          9. Limitación de responsabilidad
        </Typography>
        <Typography gutterBottom>
          En la máxima medida permitida por la ley argentina,{" "}
          <strong>Motion Crush</strong> no será responsable por daños
          indirectos, pérdida de datos, lucro cesante, fallas del Servicio ni
          interrupciones. El Servicio se brinda "tal cual" sin garantías de
          funcionamiento ininterrumpido.
        </Typography>

        {/* 10 */}
        <Typography variant="h6" gutterBottom>
          10. Suspensión o terminación del Servicio
        </Typography>
        <Typography gutterBottom>
          Podremos suspender o cancelar el acceso del Usuario si se detecta
          violación de estos Términos, actividad fraudulenta o riesgo para la
          seguridad. El Usuario también puede eliminar su cuenta en cualquier
          momento.
        </Typography>

        {/* 11 */}
        <Typography variant="h6" gutterBottom>
          11. Cambios en los Términos
        </Typography>
        <Typography gutterBottom>
          Podemos modificar estos Términos cuando sea necesario. Las
          modificaciones entrarán en vigencia desde su publicación. El uso
          continuado del Servicio implica aceptación de los cambios.
        </Typography>

        {/* 12 */}
        <Typography variant="h6" gutterBottom>
          12. Ley aplicable y jurisdicción
        </Typography>
        <Typography gutterBottom>
          Estos Términos se rigen por las leyes de la República Argentina.
          Cualquier controversia será sometida a los tribunales competentes del
          domicilio del titular de la Aplicación, salvo lo indicado por leyes de
          defensa del consumidor.
        </Typography>

        {/* 13 */}
        <Typography variant="h6" gutterBottom>
          13. Contacto
        </Typography>
        <Typography gutterBottom>
          Para consultas o solicitudes, el Usuario puede contactarse a:<br />
          <strong>motioncrushapp@gmail.com</strong>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
