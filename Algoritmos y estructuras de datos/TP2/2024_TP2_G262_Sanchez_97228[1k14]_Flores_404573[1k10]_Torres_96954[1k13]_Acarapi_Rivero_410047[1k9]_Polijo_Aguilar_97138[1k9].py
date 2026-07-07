NOMBRE_ARCHIVO = "envios25.txt"  # Ajusta segun el archivo que utilices
def extraer_final(linea):
    return linea.rstrip('\n')

def obtener_tipo_control(linea):
    if "HC" in linea:
        return "Hard Control"
    elif "SC" in linea:
        return "Soft Control"
    else:
        return "Unknown"

def extraer_datos(linea):
    codigo_postal = linea[0:9]
    codigo_postal = codigo_postal.strip()
    direccion = linea[9:29]
    direccion = direccion.strip()
    tipo_envio = int(linea[29])
    forma_pago = int(linea[30])
    return (codigo_postal, direccion, tipo_envio, forma_pago)

def es_valida_la_direccion(direccion, tipo_control):
    if tipo_control == "Hard Control":
        # Criterio para Hard Control: letras y digitos, no haya dos mayusculas seguidas y al menos una palabra compuesta en digitos.
        solo_letras_y_digitos = True
        for c in direccion:
            if c == ' ' or c == '.':
                continue
            elif c.isalnum() == False:
                solo_letras_y_digitos = False
            for i in range(len(direccion) - 1):
                mayusculas_seguidas = False
                if direccion[i].isupper() and direccion[i + 1].isupper():
                    mayusculas_seguidas = True
                    break

        palabras = direccion.split()
        for palabra in palabras:
            al_menos_una_palabra_digitos = True
            for p in palabra:
                if p == '.':
                    continue
                elif p.isdigit() == False:
                    al_menos_una_palabra_digitos = False

        return solo_letras_y_digitos and not mayusculas_seguidas and al_menos_una_palabra_digitos

    else:
        # Criterio para Soft Control: cualquiera es valida.
        return len(direccion)

def calcular_importe(tipo_envio, codigo_postal, forma_pago):
    precios_nacionales = {0: 1100, 1: 1800, 2: 2450, 3: 8300, 4: 10900, 5: 14300, 6: 17900}
    if forma_pago == 1:
        descuento = 0.1
    else:
        descuento = 0
    pais = determinar_pais(codigo_postal)
    base_price = precios_nacionales.get(tipo_envio, 0)
    if pais == "Argentina":
        return precios_nacionales.get(tipo_envio, 0) - (precios_nacionales.get(tipo_envio) * descuento)
    elif pais == "Bolivia" or pais == "Paraguay" or pais == "Montevideo":
        recargo = 0.20
        precio = (base_price - (base_price * descuento)) * (1 + recargo)
    elif pais == "Chile" or pais == "Uruguay":
        recargo = 0.25
        precio = (base_price - (base_price * descuento)) * (1 + recargo)
    elif pais == "Brasil_89":
        recargo = 0.20
        precio = (base_price - (base_price * descuento)) * (1 + recargo)
    elif pais == "Brasil_0123":
        recargo = 0.25
        precio = (base_price - (base_price * descuento)) * (1 + recargo)
    elif pais == "Brasil_4567":
        recargo = 0.30
        precio = (base_price - (base_price * descuento)) * (1 + recargo)
    else:
        recargo = 0.5
        precio = (base_price - (base_price * descuento)) * (1 + recargo)
    return int(precio)

def determinar_pais(codigo_postal):
    if len(codigo_postal) == 9 and codigo_postal[:5].isdigit() and codigo_postal[5] == '-' and codigo_postal[6:].isdigit():
        if codigo_postal[0] == '0' or codigo_postal[0] == '1' or codigo_postal[0] == '2' or codigo_postal[0] == '3':
            return "Brasil_0123"
        elif codigo_postal[0] == '4' or codigo_postal[0] == '5' or codigo_postal[0] == '6' or codigo_postal[0] == '7':
            return "Brasil_4567"
        elif codigo_postal[0] == '8' or codigo_postal[0] == '9':
            return "Brasil_89"
    elif len(codigo_postal) == 8 and codigo_postal[0].isalpha() and codigo_postal[1:5].isdigit() and codigo_postal[5:7].isalpha():
        return "Argentina"
    elif len(codigo_postal) == 4 and codigo_postal[:4].isdigit():
        return "Bolivia"
    elif len(codigo_postal) == 7 and codigo_postal[:7].isdigit():
        return "Chile"
    elif len(codigo_postal) == 6 and codigo_postal[:6].isdigit():
        return "Paraguay"
    elif len(codigo_postal) == 5 and codigo_postal[:5].isdigit() and codigo_postal[0] == '1':
        return "Montevideo"
    elif len(codigo_postal) == 5 and codigo_postal[:5].isdigit():
        return "Uruguay"
    else:
        return "Otros"
def principal():
    with open(NOMBRE_ARCHIVO, encoding="UTF-8") as archivo:
        linea = extraer_final(archivo.readline())
        tipo_control = obtener_tipo_control(linea)

        # Variables
        cedvalid = 0
        cedinvalid = 0
        imp_acu_total = 0
        ccs = ccc = cce = 0
        primer_cp = None
        cant_primer_cp = 0
        menimp = None
        mencp = 0
        total_envios = 0
        envios_exterior = 0
        sum_importe_ba = 0
        count_ba = 0


        for linea in archivo:
            total_envios += 1
            linea = extraer_final(linea)
            codigo_postal, direccion, tipo_envio, forma_pago = extraer_datos(linea)
            # Dirección como válida o no
            if es_valida_la_direccion(direccion, tipo_control):
                cedvalid += 1
            else:
                cedinvalid += 1

            # Acumular importes
            if tipo_control == "Hard Control" and es_valida_la_direccion(direccion, tipo_control) or tipo_control == "Soft Control":
                importe = int(calcular_importe(tipo_envio, codigo_postal, forma_pago))
                imp_acu_total += importe

            # Contar tipos de carta
                if tipo_envio == 0 or tipo_envio == 1 or tipo_envio == 2:
                    ccs += 1
                elif tipo_envio == 3 or tipo_envio == 4:
                    ccc += 1
                elif tipo_envio == 5 or tipo_envio == 6:
                    cce += 1

                # Verificar envíos a Brasil
                if determinar_pais(codigo_postal) == "Brasil_89" or determinar_pais(codigo_postal) == "Brasil_0123" or determinar_pais(codigo_postal) == "Brasil_4567":
                    if menimp == None:
                        menimp = importe
                    elif importe < menimp:
                        menimp = importe
                        mencp = codigo_postal

                # Acumular importes para Buenos Aires
                if determinar_pais(codigo_postal) == "Argentina":
                    if codigo_postal[0] == "B":
                        sum_importe_ba += importe
                        count_ba += 1
                else:
                    envios_exterior += 1


            # Verificar el primer código postal
            if primer_cp is None:
                primer_cp = codigo_postal
            if codigo_postal == primer_cp:
                cant_primer_cp += 1





        # Calcular el tipo de carta con mayor cantidad de envíos
        tipo_mayor = "Carta Simple" if ccs >= ccc and ccs >= cce else "Carta Certificada" if ccc > cce else "Carta Expresa"

        # Calcular el porcentaje de envíos al exterior
        porc = int(((envios_exterior / total_envios) * 100)) if total_envios > 0 else 0

        # Calcular el promedio de importes para Buenos Aires
        prom = int(sum_importe_ba / count_ba if count_ba > 0 else 0)

        # Resultados finales
        print('(r1) - Tipo de control de direcciones:', tipo_control)
        print('(r2) - Cantidad de envios con direccion valida:', cedvalid)
        print('(r3) - Cantidad de envios con direccion no valida:', cedinvalid)
        print('(r4) - Total acumulado de importes finales:', imp_acu_total)
        print('(r5) - Cantidad de cartas simples:', ccs)
        print('(r6) - Cantidad de cartas certificadas:', ccc)
        print('(r7) - Cantidad de cartas expresas:', cce)
        print('(r8) - Tipo de carta con mayor cantidad de envios:', tipo_mayor)
        print('(r9) - Codigo postal del primer envio del archivo:', primer_cp)
        print('(r10) - Cantidad de veces que entro ese primero:', cant_primer_cp)
        print('(r11) - Importe menor pagado por envios a Brasil:', menimp)
        print('(r12) - Codigo postal del envio a Brasil con importe menor:', mencp)
        print('(r13) - Porcentaje de envios al exterior sobre el total:', porc)
        print('(r14) - Importe final promedio de los envios a Buenos Aires:', prom)


if __name__ == '__main__':
    principal()