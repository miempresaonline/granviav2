import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Phone, X, MapPin, PhoneCall, Brain, Wifi, Settings2, Volume2, Star, StarHalf, Quote } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: '',
    privacyAccepted: false
  });

  const [showComments, setShowComments] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const formRef = useRef<HTMLDivElement>(null);
  const ia = useRef<HTMLDivElement>(null);
  const recargables = useRef<HTMLDivElement>(null);
  const clinicas = useRef<HTMLDivElement>(null);
  const clientes = useRef<HTMLDivElement>(null);
  const subvenciones = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const offersRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const clinicsRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Rosana Miras Arratia",
      initials: "RM",
      rating: 5,
      text: "He tenido una experiencia excelente en esta clínica audiológica. El precio de los servicios es muy asequible, lo cual fue una grata sorpresa. Además, el audífono que me recomendaron es de gran calidad y ha mejorado significativamente mi calidad de vida."
    },
    {
      name: "mylia dominguez",
      initials: "MD",
      rating: 5,
      text: "Los audifonos comprados estan dando buen resultado, he venido a hacer la revisión y el trato increíble por parte de los empleados, si lo necesito en un futuro sin duda volveré 😊😊!"
    },
    {
      name: "Ana Conde Moreda",
      initials: "AC",
      rating: 5,
      text: "Muy buena atención y variedad de presupuestos, lo recomiendo. El personal es profesional y amable, ofreciendo un servicio personalizado y atento. Recomiendo esta clínica a cualquiera que busque soluciones auditivas de calidad a precios razonables"
    },
    {
      name: "Maicoll Martínez sosa",
      initials: "MM",
      rating: 5,
      text: "Acudimos al centro gracias a recomendaciones de conocidos y nos quedamos muy satisfechos con la atención recibida, sobre todo por el trato y la amabilidad. Nos atendió una chica joven muy carismática."
    },
    {
      name: "Irati herran",
      initials: "IR",
      rating: 5,
      text: "Conocí el centro gracias a una amiga y fui con un familiar. El trato fue inmejorable y nos ayudaron en todo momento a entender las causas del problema. Nos atendieron rápido y fueron muy eficaces encontrando una solución."
    },
    {
      name: "Roberto L.",
      initials: "RL",
      rating: 5,
      text: "La tecnología de inteligencia artificial es impresionante. Se adaptan automáticamente a cada situación. Hemos cambiado unos de unos cuantos años y la diferencia se nota, merece la pena. Recomendamos esta clínica"
    }
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-view');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Carousel auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const navHeight = 80;
      const formHeight = ref.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const formTop = ref.current.getBoundingClientRect().top + window.pageYOffset;
      
      const scrollPosition = formTop - ((windowHeight - formHeight) / 2);
      
      window.scrollTo({
        top: scrollPosition - navHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : null;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const executeRecaptcha = async () => {
    try {
      return await window.grecaptcha.execute('6LdZSuMqAAAAACxLSkJ8KgkthaLrFcqLDs2VKX_X', { action: 'submit' });
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      return null;
    }
  };

  const submitToWebhook = async (data: typeof formData, recaptchaToken: string) => {
    try {
      const response = await fetch('https://hook.eu2.make.com/9bgn1tqn4k8r1t942j1na8l7eb4g38vk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
          source: 'website_form',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacyAccepted) {
      alert('Debes aceptar la política de privacidad para continuar.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha();
      
      if (!recaptchaToken) {
        throw new Error('Failed to execute reCAPTCHA');
      }

      const success = await submitToWebhook(formData, recaptchaToken);
      
      if (success) {
        setIsSubmitted(true);
      } else {
        alert('Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMainThankYouMessage = () => (
    <div className="text-center p-8 animate-fade-in">
      <h3 className="text-2xl font-bold mb-4 text-white">¡Gracias {formData.name}!</h3>
      <p className="text-lg mb-6 text-white">
        Hemos recibido tu solicitud correctamente. En breve nos pondremos en contacto contigo.
      </p>
      <button
        onClick={() => setIsSubmitted(false)}
        className="bg-[#9c0720] hover:bg-[#666666] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
      >
        Cerrar
      </button>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Tu Nombre"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Tu Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>
      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Tu Teléfono"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>
      <div>
        <textarea
          name="comments"
          placeholder="¿Quieres comentarnos algo?"
          value={formData.comments}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all h-24"
        />
      </div>
      
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          name="privacyAccepted"
          id="privacy-main"
          checked={formData.privacyAccepted}
          onChange={handleInputChange}
          className="mt-1"
          required
        />
        <label htmlFor="privacy-main" className="text-sm text-gray-300">
          He leído y acepto la{' '}
          <button 
            type="button"
            onClick={() => setShowPrivacyPolicy(true)}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            política de privacidad
          </button>
        </label>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-black text-white relative pb-[60px] sm:pb-0">
      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="bg-white text-black p-8 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative animate-scale-up">
            <button 
              onClick={() => setShowPrivacyPolicy(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Aviso Legal | POLÍTICA DE PRIVACIDAD</h2>
            <div className="prose prose-sm max-w-none">
              <p>Esta página Web es titularidad de UNOSORD, cuyos datos de identificación son los siguientes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>C/ Bilbao Gran Vía 72-1º 48010 (administración)</li>
                <li>Inscrita fecha 21/11/2011 ; tomo 29365; folio 42; inscripción 1 con hoja M - 528584</li>
                <li>B86330768</li>
                <li>Teléfono: 900 840 079 (gratuito) e-Mail: gea@gea-audifonos.com</li>
              </ul>
              
              <p>Es el titular de la web, no obstante se hace referencia a los servicios prestados por las empresas del grupo.</p>
              <p>En adelante, nos referiremos conjuntamente a las empresas mencionadas como 'LA EMPRESA'.</p>

              <h3 className="text-xl font-bold mt-6 mb-4">1. INFORMACIÓN Y CONSENTIMIENTO</h3>
              <p>Mediante la aceptación de la presente Política de Privacidad, el Usuario queda informado y presta su consentimiento libre, informado, específico e inequívoco para que los datos personales que facilite a través de esta página Web sean tratados por "LA EMPRESA".</p>

              <h3 className="text-xl font-bold mt-6 mb-4">2. OBLIGATORIEDAD DE FACILITAR LOS DATOS</h3>
              <p>Los datos solicitados en los formularios de la Web son con carácter general, obligatorios (salvo que en el campo requerido se especifique lo contrario) para cumplir con las finalidades establecidas. Por lo tanto, si no se facilitan los mismos o no se facilitan correctamente no podrán atenderse las mismas, sin perjuicio de que podrá visualizar libremente el contenido del Sitio Web.</p>

              <h3 className="text-xl font-bold mt-6 mb-4">3. FINALIDADES DEL TRATAMIENTO</h3>
              <p>Los datos personales facilitados a través del Sitio Web serán tratados conforme a las siguientes finalidades:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Gestionar, tramitar y dar respuesta a peticiones, solicitudes, incidencias o consultas del Usuario.</li>
                <li>Remitir periódicamente comunicaciones comerciales sobre productos, servicios, promociones, ofertas, eventos o noticias que puedan resultar de su interés.</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-4">4. DATOS DEL USUARIO</h3>
              <p>Se tratarán las siguientes categorías de datos del Usuario:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Datos identificativos: nombre, apellidos y DNI.</li>
                <li>Datos de contacto: dirección postal, dirección de correo electrónico y teléfono.</li>
                <li>Datos de facturación</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-4">5. LEGITIMACIÓN</h3>
              <p>El tratamiento de los datos está basado en el consentimiento que se le solicita y que puede retirar en cualquier momento. No obstante, en caso de retirar su consentimiento, ello no afectará a la licitud de los tratamientos efectuados con anterioridad.</p>

              <h3 className="text-xl font-bold mt-6 mb-4">6. DESTINATARIOS</h3>
              <p>Los datos podrán ser comunicados a los centros y ópticas asociados a GEA, grupo empresarial audiológico, con la finalidad de hacer llegar una oferta personalizada y cercana a usted.</p>

              <h3 className="text-xl font-bold mt-6 mb-4">7. RESPONSABILIDAD DEL USUARIO</h3>
              <p>El Usuario garantiza que:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Es mayor de 18 años.</li>
                <li>Los datos facilitados son verdaderos, exactos, completos y actualizados.</li>
                <li>Será responsable de las informaciones falsas o inexactas que proporcione.</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-4">8. MEDIDAS DE SEGURIDAD</h3>
              <p>LA EMPRESA ha adoptado los niveles de seguridad de protección de datos personales legalmente requeridos y procura instalar aquellos otros medios y medidas técnicas adicionales a su alcance para evitar la pérdida, mal uso, alteración, acceso no autorizado y robo de los datos personales facilitados.</p>

              <h3 className="text-xl font-bold mt-6 mb-4">9. EJERCICIO DE DERECHOS</h3>
              <p>El Usuario puede ejercer sus derechos de:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Acceso, rectificación, supresión</li>
                <li>Oposición, limitación, portabilidad</li>
                <li>Reclamación ante la Agencia Española de Protección de Datos</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white z-50 flex items-center justify-around sm:hidden">
        <a 
          href="tel:944987951" 
          className="flex items-center justify-center space-x-2 text-[#9c0720]"
        >
          <Phone className="w-6 h-6" />
          <span className="font-semibold">Llamar</span>
        </a>
        <a 
          href="https://wa.me/34688696427" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center space-x-2 text-[#25D366]"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="font-semibold">WhatsApp</span>
        </a>
      </div>

      <section className="relative bg-gradient-to-r from-gray-900 to-black pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative animate-fade-in-left">
              <img 
                src="https://www.miempresa.online/wp-content/uploads/2025/02/audifonos-al-mejor-precio.jpg"
                alt="Persona usando audífonos"
                className="rounded-lg shadow-2xl w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 rounded-lg"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="space-y-6">
                  <div className="text-4xl font-bold tracking-tight">
                    Unidades limitadas
                  </div>
                  <div className="bg-[#9c0720] px-8 py-4 rounded-lg shadow-lg">
                    <span className="block text-2xl font-bold">-60 % descuento</span>
                    <span className="block text-2xl font-bold ">¡1 Mes de prueba gratis!</span>
                  </div>
                  <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-lg shadow-lg">
                    <span className="block text-2xl font-bold text-gray-400 ">¿Tienes un presupuesto?</span>
                    <span className="block text-2xl font-bold ">Te lo mejoramos</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl animate-fade-in-right">
              <h2 className="text-3xl font-bold mb-2">
                Te ayudamos a encontrar el{' '}
                <span className="text-red-800">mejor precio</span> para tus audífonos
              </h2>
              <p className="text-gray-300 mb-6">INFÓMATE DE LAS SUBVENCIONES DISPONIBLES</p>
              <section ref={formRef} className="">
                {isSubmitted ? renderMainThankYouMessage() : renderForm()}
              </section>
            </div>
          </div>
        </div>
      </section>

     <section ref={recargables} className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <img 
                src="https://www.audifonosgranviabilbao.com/uploads/casas/rd/audifonosgranviabilbao/webs/WhatsApp_Image_2020_11_12_at_11.14.45.jpg"
                alt="Studio Pro"
                className="rounded-lg w-full"
              />
              <div className="flex w-full overflow-hidden max">
                <div className="bg-[#8B1538] text-white py-3 px-6 flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm uppercase">PRECIO OFERTA</div>
                    <div className="text-3xl font-bold">995€</div>
                  </div>
                </div>
                <div className="bg-black text-white py-3 px-6 flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm uppercase">PRECIO ORIGINAL</div>
                    <div className="text-3xl font-bold line-through">2490€</div>
                  </div>
                </div>
                <div className="bg-[#C88B9F] text-white py-3 px-6 flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm uppercase">DESCUENTO</div>
                    <div className="text-3xl font-bold">60%</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Audífonos recargable sin pilas</h2>
              <p className="text-gray-400 mb-8">
                incluido el cargador, rehabilitación auditiva valorada en 500€, seguro a todo riesgo incluido, revisiones gratuitas de por vida, por sólo 995€ en lugar de 2.499€ (60% de descuento).
              </p>
              <button 
                onClick={() => scrollToSection(formRef)}
                className="group bg-[#9c0720] hover:bg-[#666666] text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span className="font-semibold">¡Lo quiero!</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      

      <header className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-fixed"
          style={{
            backgroundImage: 'url(https://www.miempresa.online/wp-content/uploads/2025/02/audifonos.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <nav className="fixed top-0 w-full p-6 bg-white shadow-md z-40">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex-1 sm:flex-none flex justify-center sm:justify-start">
              <img 
                src="https://www.audifonosgranviabilbao.com/uploads/logos/audifonosgranviabilbao.png"
                alt="Gran Vía Clínicas Audiológicas"
                className="h-6 sm:h-12"
              />
            </div>
            <div className="hidden sm:flex flex-1 justify-center items-center space-x-12">
              <button 
                onClick={() => scrollToSection(formRef)}
                className="text-gray-800 hover:text-[#9c0720] transition-colors duration-300"
              >
                Solicitar información
              </button>
              <button 
                onClick={() => scrollToSection(recargables)}
                className="text-gray-800 hover:text-[#9c0720] transition-colors duration-300"
              >
                Recargables
              </button>
              <button 
                onClick={() => scrollToSection(subvenciones)}
                className="text-gray-800 hover:text-[#9c0720] transition-colors duration-300"
              >
                Subvenciones
              </button>
              <button 
                onClick={() => scrollToSection(ia)}
                className="text-gray-800 hover:text-[#9c0720] transition-colors duration-300"
              >
                Con IA
              </button>

              <button 
                onClick={() => scrollToSection(brandsRef)}
                className="text-gray-800 hover:text-[#9c0720] transition-colors duration-300"
              >
                Marcas
              </button>

                  <button 
                onClick={() => scrollToSection(clientes)}
                className="text-gray-800 hover:text-[#9c0720] transition-colors duration-300"
              >
                Clientes
              </button>

              <button 
                onClick={() => scrollToSection(clinicas)}
                className="text-gray-800 hover:text-[#9c0720] transition-colors duration-300"
              >
                Clínicas
              </button>
            </div>
            <div className="w-[100px] sm:block hidden"></div>
          </div>
        </nav>
        <section ref={subvenciones} className="py-20 bg-gradient-to-b from-blue-900 to-black">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-3xl px-6 animate-on-scroll">
            <h1 className="text-6xl font-bold mb-6">-60% DESCUENTO</h1>
            <p className="text-xl mb-8">¡1 més de prueba gratis!</p>
            <button 
              onClick={() => scrollToSection(formRef)}
              className="cta-button bg-white text-black px-8 py-3 rounded-full font-semibold"
            >
              Pregunta por las subvenciones
            </button>
          </div>
        </div>
        </section>
      </header>

      {/* AI Hearing Aids Section */}
      <section ref={ia} className="py-20 bg-gradient-to-b from-blue-900 to-black">
      
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Revoluciona tu Audición con la Tecnología más Avanzada: Audífonos con IA
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Gracias a la inteligencia artificial, nuestros audífonos no solo amplifican el sonido, sino que se adaptan a tu entorno para ofrecerte una experiencia auditiva única y personalizada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold mb-6">Tecnología que Evoluciona Contigo</h3>
              <p className="text-gray-300">
                Nuestros audífonos con IA utilizan algoritmos avanzados de aprendizaje automático para analizar constantemente tu entorno auditivo. Se adaptan en tiempo real a diferentes situaciones, proporcionando una claridad de sonido excepcional y una experiencia auditiva natural.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                  <Brain className="w-12 h-12 text-blue-400 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Adaptación Automática</h4>
                  <p className="text-sm text-gray-400">Ajuste automático del volumen y calidad del sonido según el entorno</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                  <Volume2 className="w-12 h-12 text-purple-400 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Reducción de Ruido</h4>
                  <p className="text-sm text-gray-400">Filtrado inteligente de ruidos de fondo no deseados</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                  <Wifi className="w-12 h-12 text-green-400 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Conexión Inalámbrica</h4>
                  <p className="text-sm text-gray-400">Conectividad perfecta con dispositivos móviles y TV</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                  <Settings2 className="w-12 h-12 text-yellow-400 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Personalización IA</h4>
                  <p className="text-sm text-gray-400">Aprendizaje y ajuste automático de parámetros</p>
                </div>
              </div>
            </div>
            <div className="relative nomovil">
              <img 
                src="https://vitalsord.com/wp-content/uploads/2025/06/AUDIFONOS-IA.png"
                alt="Audífonos con Inteligencia Artificial"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-2xl nomovil"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-sm p-6 rounded-xl nomovil">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 nomovil">
                    <h4 className="text-lg font-semibold mb-1">Prueba Gratuita</h4>
                    <p className="text-sm text-gray-300">Experimenta la diferencia durante 30 días sin compromiso</p>
                  </div>
                  <button 
                    onClick={() => scrollToSection(formRef)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span>Solicitar</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 rounded-xl backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3">Claridad Mejorada</h4>
              <p className="text-gray-400">Disfruta de una calidad de sonido cristalina con nuestra tecnología de procesamiento avanzado</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-xl backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3">Comodidad Total</h4>
              <p className="text-gray-400">Diseño ergonómico personalizado para un ajuste perfecto y uso prolongado</p>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-red-600/20 p-6 rounded-xl backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3">Uso Intuitivo</h4>
              <p className="text-gray-400">Control sencillo mediante aplicación móvil y ajustes automáticos inteligentes</p>
            </div>
            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 p-6 rounded-xl backdrop-blur-sm">
              <h4 className="text-xl font-semibold mb-3">Larga Duración</h4>
              <p className="text-gray-400">Batería de alta capacidad y materiales premium para una mayor durabilidad</p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => scrollToSection(formRef)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Solicita una prueba gratuita
            </button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section ref={brandsRef} className="py-20 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Trabajamos con las mejores marcas</h2>
          
          <div className="logos-slider-container overflow-hidden relative">
            <div className="logos-slider flex animate-marquee">
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosSignia?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/signia.png" 
                  alt="Signia"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosPhonak?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/phonak.png" 
                  alt="Phonak"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosOticon?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/oticon.png" 
                  alt="Oticon"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosResound?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/resound.png" 
                  alt="ReSound"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosWidex?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/widex.png" 
                  alt="Widex"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosStarkey?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/starkey.png" 
                  alt="Starkey"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              {/* Duplicate logos for seamless looping */}
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosSignia?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/signia.png" 
                  alt="Signia"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosPhonak?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/phonak.png" 
                  alt="Phonak"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosOticon?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/oticon.png" 
                  alt="Oticon"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosResound?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/resound.png" 
                  alt="ReSound"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosWidex?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/widex.png" 
                  alt="Widex"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="logo-item flex-shrink-0 px-8">
                <img 
                  src="https://www.guiadelaudifono.com/cacheimgwebp/AudifonosStarkey?zc=2&w=500&h=500&src=/uploads/casas/eu/guiadelaudifono/tablas/starkey.png" 
                  alt="Starkey"
                  className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg mb-6">Trabajamos con las marcas líderes en el mercado para ofrecerte la mejor calidad y tecnología en audífonos</p>
            <button 
              onClick={() => scrollToSection(formRef)}
              className="bg-[#9c0720] hover:bg-[#666666] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Solicitar información
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Nuestros Modelos de Audífonos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="p-6">
                <img 
                  src="https://www.miempresa.online/wp-content/uploads/2025/02/Silk-Charge-Go-IX_black_pair_shadow_1000x1000.jpg" 
                  alt="Alain Afflelou Incognito IC16"
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mejores precios</h3>
                <p className="text-gray-600 mb-4">Consigue audífonos al mejor precio y con 1 mes de prueba gratis sin compromiso.</p>
                <button 
                  onClick={() => scrollToSection(formRef)}
                  className="w-full bg-[#9c0720] text-white py-2 px-4 rounded-lg hover:bg-[#666666] transition-colors duration-300"
                >
                  Conseguir descuento
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="p-6">
                <img 
                  src="https://www.miempresa.online/wp-content/uploads/2025/02/Styletto-IX_black_silver_double_1000x1000.jpg" 
                  alt="Resound ONE a medida"
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Modernos</h3>
                <p className="text-gray-600 mb-4">Representa una generación nueva de audífonos. Son audífonos recargables para disfrutar de lo mejor de los audífonos y de los auriculares.</p>
                <button 
                  onClick={() => scrollToSection(formRef)}
                  className="w-full bg-[#9c0720] text-white py-2 px-4 rounded-lg hover:bg-[#666666] transition-colors duration-300"
                >
                  Conseguir descuento
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="p-6">
                <img 
                  src="https://www.miempresa.online/wp-content/uploads/2025/02/Pure-Charge-Go-IX_graphite_pair_1000x1000.jpg" 
                  alt="Phonak Virto Paradise"
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Discretos</h3>
                <p className="text-gray-600 mb-4">Audífonos con un diseño discreto y personalizado para cada usuario. Ofrecen una brillante comprensión de la palabra y sonido natural.</p>
                <button 
                  onClick={() => scrollToSection(formRef)}
                  className="w-full bg-[#9c0720] text-white py-2 px-4 rounded-lg hover:bg-[#666666] transition-colors duration-300"
                >
                  Conseguir descuento
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section - Ultra compact for mobile */}
      <section ref={clientes} className="py-20 bg-white">  
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes en Google My Bussines</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escucha las experiencias de quienes ya han mejorado su audición con nuestros audífonos de última tecnología.
            </p>
          </div>

          {/* Ultra-compact Carousel Container */}
          <div className="testimonials-ultra-compact">
            <div className="testimonials-track-ultra">
              <div 
                className="testimonials-slider-ultra"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="testimonial-item-ultra">
                    <div className="testimonial-content-ultra">
                      <div className="testimonial-header-ultra">
                        <div className="testimonial-avatar-ultra">
                          {testimonial.initials}
                        </div>
                        <div className="testimonial-info-ultra">
                          <h3 className="testimonial-name-ultra">{testimonial.name}</h3>
                          <div className="testimonial-rating-ultra">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="star-ultra" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Quote className="quote-ultra" />
                      <p className="testimonial-text-ultra">
                        {testimonial.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ultra-compact Indicators */}
            <div className="testimonial-indicators-ultra">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`indicator-ultra ${
                    index === currentTestimonial ? 'active-ultra' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="testimonial-cta-ultra">
            <button 
              onClick={() => scrollToSection(formRef)}
              className="bg-[#9c0720] hover:bg-[#666666] text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="font-semibold">Quiero mis audífonos</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Clinics Section */}
      <section ref={clinicas} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Nuestras Clínicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clinic 1 */}
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-[400px]">
                <img 
                  src="https://www.audifonosgranviabilbao.com/cacheimg/GranV%C3%ADadeDonDiegoL%C3%B3pezdeHaro?zc=1&w=500&h=400&src=/uploads/casas/rd/audifonosgranviabilbao/directorio/12adee43ad3e4404211fb5eeb70a4a04_tienda1.jpg"
                  alt="Clínica Gran Vía"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gran Vía de Don Diego López de Haro</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#9c0720] flex-shrink-0 mt-1" />
                    <p className="text-gray-700">Gran Vía de Don Diego López de Haro, 72, 48012 Bilbao, Vizcaya</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneCall className="w-5 h-5 text-[#9c0720]" />
                    <a href="tel:+34944987951" className="text-gray-700 hover:text-[#9c0720] transition-colors">
                      (+34) 94 498 79 51
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinic 2 */}
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-[400px]">
                <img 
                  src="https://www.audifonosgranviabilbao.com/cacheimg/Rekalde-LarraskituErrepidea?zc=1&w=500&h=400&src=/uploads/casas/rd/audifonosgranviabilbao/directorio/5439830b71f7328408da796bd7bc6bc0_img_9227.jpg"
                  alt="Clínica Rekalde"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rekalde-Larraskitu</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#9c0720] flex-shrink-0 mt-1" />
                    <p className="text-gray-700">Rekalde-Larraskitu Errepidea, 1a; dpto. 7, 48002 Bilbao, Vizcaya</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneCall className="w-5 h-5 text-[#9c0720]" />
                    <a href="tel:+34944392250" className="text-gray-700 hover:text-[#9c0720] transition-colors">
                      (+34) 94 439 22 50
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-black text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">SOLICITA INFORMACIÓN</h2>
          <p className="text-xl mb-8">Sin compromiso</p>
          <button 
            onClick={() => scrollToSection(formRef)}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Solicitar
          </button>
        </div>
      </section>

      <footer className="bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Copyright © Clinica Gran via Bilbao</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-white"
                >
                  Aviso legal
                </button>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-white"
                >
                  Términos y Condiciones
                </button>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-white"
                >
                  Política de Privacidad
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;