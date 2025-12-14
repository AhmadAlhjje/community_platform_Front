import Link from 'next/link'
import { Heart, Mail, FileText, Shield, Users, Info } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* عن المنصة */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-600" />
              عن المنصة
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              منصة مجتمعية تهدف إلى تعزيز الوعي المجتمعي، التماسك الاجتماعي، والمواطنة الفاعلة من خلال المشاركة والتفاعل البنّاء.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* السياسات والقواعد */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              السياسات والقواعد
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link
                  href="/community-guidelines"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  قواعد المجتمع
                </Link>
              </li>
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              تواصل معنا
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              نسعد بتواصلك معنا وتلقي استفساراتك واقتراحاتك
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              أرسل رسالة
            </Link>
          </div>
        </div>

        {/* الفاصل */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} منصة الوعي المجتمعي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
