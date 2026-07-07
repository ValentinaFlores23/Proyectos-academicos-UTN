
class Envio:
    def __init__(self, cp, direc, tenv, fpag, pais):
        self.codpostal = cp.strip()
        self.direccion = direc.strip()
        self.tipenv = int(tenv)
        self.formadepago = int(fpag)
        self.pais = pais.strip()

    def __str__(self):
        return (f"Codigo postal: {self.codpostal:<10} | "
                f"Direccion: {self.direccion:<20} | "
                f"Tipo de envio: {self.tipenv:<2} | "
                f"Forma de pago: {self.formadepago:<2} | "
                f"Pais: {self.pais:<2}")


def leer_texto():
    fd = 'envios-tp3.txt'
    texto = []

    try:
        with open(fd, 'rt') as m:
            primeralinea = m.readline().strip()
            control = 'Soft Control' if 'SC' in primeralinea else 'Hard Control'

            for line in m:
                if len(line) < 31:
                    continue  # Saltar líneas mal formateadas
                cp = line[0:9]
                direc = line[9:29]
                tenv = line[29]
                fpag = line[30]
                pais = determinar_pais(cp)
                texto.append(Envio(cp, direc, tenv, fpag, pais))
    except FileNotFoundError:
        print(f"El archivo {fd} no se encuentra.")
    except Exception as e:
        print(f"Se produjo un error: {e}")

    print("Archivo leído exitosamente.")
    return control, texto


def validar_direccion(direccion):
    # Implementar la validación para HC aquí
    if len(direccion) == 0:
        return False

    has_digit = any(char.isdigit() for char in direccion)
    if not has_digit:
        return False

    prev_char = ""
    cant_char = 0
    cant_dig = 0
    solodig = False
    for char in direccion:
        if char not in " .":
            cant_char += 1
            if char.isupper() and prev_char.isupper():
                return False
            if not char.isdigit() and not char.isalpha():
                return False
            if char.isdigit():
                cant_dig += 1
        else:
            if cant_dig == cant_char:
                solodig = True
            cant_char = 0
            cant_dig = 0

        prev_char = char
    return solodig


def cargar():
    print("Cargar nuevo envío")
    cp = input("Ingrese código postal: ")
    direccion = input("Ingrese dirección de destino: ")
    tipoenv = int(input("Ingrese tipo de envío (número entre 0 y 6): "))
    while tipoenv < 0 or tipoenv > 6:
        print("Tipo de envío no válido. Debe ingresar un número entre 0 y 6.")
        tipoenv = int(input("Ingrese tipo de envío (número entre 0 y 6): "))
    pago = int(input("Ingrese forma de pago (1 efectivo, 2 tarjeta de crédito): "))
    while pago < 1 or pago > 2:
        print("Forma de pago incorrecta. Debe ingresar 1 para efectivo o 2 para tarjeta de crédito.")
        pago = int(input("Ingrese forma de pago (1 efectivo, 2 tarjeta de crédito): "))

    return Envio(cp, direccion, tipoenv, pago, determinar_pais(cp))


def ordenar_por_codigo_postal(arr):
    for i in range(1, len(arr)):
        envio_actual = arr[i]
        j = i - 1
        while j >= 0 and arr[j].codpostal > envio_actual.codpostal:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = envio_actual
    return arr


def determinar_pais(codigo_postal):
    codigo_postal = codigo_postal.strip()  # eliminar espacios

    if len(codigo_postal) == 9:
        if codigo_postal[:5].isdigit() and codigo_postal[5] == '-' and codigo_postal[6:].isdigit():
            if codigo_postal[0] in '0123':
                return "Brasil_0123"
            elif codigo_postal[0] in '4567':
                return "Brasil_4567"
            elif codigo_postal[0] in '89':
                return "Brasil_89"
    elif len(codigo_postal) == 8:
        if codigo_postal[0].isalpha() and codigo_postal[1:5].isdigit() and codigo_postal[5:7].isalpha():
            return "Argentina"
    elif len(codigo_postal) == 4 and codigo_postal.isdigit():
        return "Bolivia"
    elif len(codigo_postal) == 7 and codigo_postal.isdigit():
        return "Chile"
    elif len(codigo_postal) == 6 and codigo_postal.isdigit():
        return "Paraguay"
    elif len(codigo_postal) == 5 and codigo_postal.isdigit():
        if codigo_postal.startswith('1'):
            return "Montevideo"
        return "Uruguay"
    return "Otros"


def mostrar(arreglo):
    n = validate("¿Desea mostrar todos los registros?. Ingrese 1 por SI, 0 por NO.  ")
    if n == 1:
        for envio in arreglo:
            print(envio)
    elif n == 0:
        cant = int(input("Ingrese cantidad de envios que desea mostrar: "))
        for i in range(cant):
            print(arreglo[i])


def validate(mensaje):
    n = int(input(mensaje))
    while n != 0 and n != 1:
        print("El numero ingresado no es valido.")
        n = int(input(mensaje))
    return n


def buscar(arreglo, direccion, tipo_envio):
    encontrados = [envio for envio in arreglo if envio.direccion == direccion and envio.tipenv == tipo_envio]
    if encontrados:
        for envio in encontrados:
            print(envio)
            break
    else:
        print("No se encontró el envío")


def buscarcp(arreglo, codigo_postal):
    # Filtramos los envíos que coinciden con el código postal
    encontrados = [envio for envio in arreglo if envio.codpostal == codigo_postal]

    # Si se encuentran envíos, los procesamos
    if encontrados:
        for envio in encontrados:
            # Revisamos el carácter en la posición 29
            if envio.formadepago == 1:
                # Si es '1', lo cambiamos a '2'
                envio.formadepago = 2
                print(envio)
                break
            elif envio.formadepago == 2:
                # Si no es '1', lo cambiamos a '1'
                envio.formadepago = 1
                print(envio)
                break

    else:
        print("No se encontró el codigo postal ingresado")


def cantidad_direcciones_validas(arreglo, tipo_control):
    arreglotipenv = [0, 0, 0, 0, 0, 0, 0]
    if tipo_control == 'Hard Control':
        for envio in arreglo:
            if validar_direccion(envio.direccion):
                arreglotipenv[envio.tipenv] += 1
        return arreglotipenv
    else:
        for envio in arreglo:
            arreglotipenv[envio.tipenv] += 1
        return arreglotipenv


def importe_acumulado(arreglo, tipo_control):
    arregloimpacu = [0, 0, 0, 0, 0, 0, 0]
    if tipo_control == 'Hard Control':
        for envio in arreglo:
            if validar_direccion(envio.direccion):
                arregloimpacu[envio.tipenv] += calcular_importe(envio.tipenv, envio.codpostal, envio.formadepago)
        return arregloimpacu
    else:
        for envio in arreglo:
            arregloimpacu[envio.tipenv] += calcular_importe(envio.tipenv, envio.codpostal, envio.formadepago)
        return arregloimpacu


def buscar_mayor(importe):
    mayor = importe[0]
    indice = 0
    for i in range(len(importe)):
        if importe[i] > mayor:
            mayor = importe[i]
            indice = i
    return mayor, indice


def porcentaje(importe_total, mayor):
    total = 0
    for i in importe_total:
        total += i
    return (mayor * 100) / total


def promedio(arreglo_envio):
    total = 0
    for envio in arreglo_envio:
        total += calcular_importe(envio.tipenv, envio.codpostal, envio.formadepago)
    return total / len(arreglo_envio)


def cant_menor(prom, arreglo):
    menor = 0
    for envio in arreglo:
        if calcular_importe(envio.tipenv, envio.codpostal, envio.formadepago) < prom:
            menor += 1
    return menor


def calcular_importe(tipo_envio, codigo_postal, forma_pago):
    # precios segun el tipo de envio
    precios_nacionales = {0: 1100, 1: 1800, 2: 2450, 3: 8300, 4: 10900, 5: 14300, 6: 17900}
    # recargos segun el pais
    recargos = {"Brasil_89": 0.20, "Brasil_4567": 0.30, "Brasil_0123": 0.25, "Chile": 0.25, "Paraguay": 0.20,
                "Bolivia": 0.20, "Montevideo": 0.20, "Uruguay": 0.25, "Otros": 0.50}
    # forma de pago
    if forma_pago == 1:
        descuento = float(0.1)
    else:
        descuento = 0

    pais = determinar_pais(codigo_postal)
    base_price = precios_nacionales.get(tipo_envio, 0)
    if pais == "Argentina":
        return precios_nacionales.get(tipo_envio, 0) - (precios_nacionales.get(tipo_envio) * descuento)
    else:
        recargo = recargos.get(pais, 0.5)
        precio = base_price * (1 + recargo)
        return precio - (precio * descuento)


def menu():
    print()
    print("Menú de opciones:")
    print("0. Finalizar el programa.")
    print("1. Crear el arreglo de registros con los datos de todos los envíos.")
    print("2. Cargar por teclado los datos de un envío y agregarlos al arreglo.")
    print("3. Mostrar todos los registros del arreglo, ordenados por código postal, de menor a mayor.")
    print("4. Buscar un envío por dirección y tipo.")
    print("5. Buscar un envío por codigo postal.")
    print("6. Determinar la cantidad de envíos con dirección válida.")
    print("7. Determinar el importe final acumulado por pagos de envíos con dirección válida según HC.")
    print("8. Mostrar cuál fue el tipo de envío con mayor importe final acumulado, y qué porcentaje representa"
          " ese monto.")
    print("9. Mostrar el importe final promedio de todos los envíos y cuántos tuvieron un importe menor al promedio.")
    print()
