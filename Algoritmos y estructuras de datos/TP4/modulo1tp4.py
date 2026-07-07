import os.path
import pickle
import io


class Envio:
    def __init__(self, cp, direc, tenv, fpag, pais):
        self.codpostal = cp.strip()
        self.direccion = direc.strip()
        self.tipenv = str(tenv)
        self.formadepago = str(fpag)
        self.pais = pais.strip()

    def __str__(self):
        return (f"Codigo postal: {self.codpostal:<9} | "
                f"Direccion: {self.direccion:<19} | "
                f"Tipo de envio: {self.tipenv:<2} | "
                f"Forma de pago: {self.formadepago:<2} | "
                f"Pais: {self.pais:<2}")


def leer_texto(linecont):
    fd = 'envios-tp4.csv'

    try:
        with open(fd, 'rt') as m:
            fdb = open('prueba.num', 'wb')
            primeralinea = m.readline().strip()
            segundalinea = m.readline().strip()

            for line in m:
                comacont = 0
                arr = ''
                for k in line:
                    if k != ',' and comacont != 3:
                        arr += k
                    elif k == ',' and comacont == 0:
                        comacont += 1
                        cp = arr
                        arr = ''
                    elif k == ',' and comacont == 1:
                        comacont += 1
                        direc = arr
                        arr = ''
                    elif k == ',' and comacont == 2:
                        comacont += 1
                        tenv = arr
                        arr = ''
                    elif k != '':
                        fpag = k
                        break
                pais = determinar_pais(cp)
                pickle.dump(Envio(cp, direc, tenv, fpag, pais), fdb)
                linecont += 1
            fdb.close()
            print("Archivo leído exitosamente.")
            return linecont

    except FileNotFoundError:
        print(f"El archivo {fd} no se encuentra.")
    except Exception as e:
        print(f"Se produjo un error: {e}")


def validar_rango(minimo, maximo, mensaje):
    n = int(input(mensaje))
    while n < minimo or n > maximo:
        print('El numero ingresado no es valido. ' + mensaje)
        n = int(input(mensaje))
    return n


def cargar():
    print("Cargar nuevo envío: ")
    cp = input("Ingrese código postal: ")
    direccion = input("Ingrese dirección de destino: ")
    tipoenv = validar_rango(0, 6, "Ingrese tipo de envío (número entre 0 y 6): ")
    pago = validar_rango(1, 2, "Ingrese forma de pago (1: efectivo, 2: tarjeta de crédito): ")

    return Envio(cp, direccion, tipoenv, pago, determinar_pais(cp))


def agregarreg(envio):
    fdb = open('prueba.num', 'ab')
    pickle.dump(envio, fdb)
    fdb.close()


def determinar_pais(codigo_postal):
    codigo_postal = codigo_postal.strip()

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


def mostrar(linecont):
    fdb = open('prueba.num', 'rb')

    for i in range(linecont):
        registro = pickle.load(fdb)
        print(registro)
    fdb.close()


def buscarcp(fdb):
    cp = input("Ingrese el codigo postal que desea buscar: ")
    cant = 0
    if os.path.exists(fdb):
        mb = open(fdb, "rb")
        mb.seek(0, io.SEEK_SET)
        t = os.path.getsize(fdb)

        while mb.tell() < t:
            r = pickle.load(mb)
            if cp == r.codpostal:
                print(r)
                cant += 1
        mb.close()
        if cant != 0:
            print("Se ha/n mostrado", cant, "envio/s")
        else:
            print("No se encontraron envios con el codigo postal ingresado.")
    else:
        print("El archivo binario no existe.")


def buscar(fdb):
    d = input("Ingrese dirección a buscar: ")
    encontrado = False
    if os.path.exists(fdb):
        mb = open(fdb, "rb")
        t = os.path.getsize(fdb)
        while mb.tell() < t:
            r = pickle.load(mb)
            if d == r.direccion:
                encontrado = True
                print(r)
                break
        mb.close()
        if not encontrado:
            print("No se encontró un envio con la direccion ingresada.")
    else:
        print("El archivo binario no existe.")


def cantidad_direcciones_validas(fdb, linecont):
    arreglotipenv = [[0, 0] for _ in range(7)]
    mb = open(fdb, "rb")
    for i in range(linecont):
        r = pickle.load(mb)
        arreglotipenv[int(r.tipenv)][int(r.formadepago) - 1] += 1
    return arreglotipenv


def totalizar_envios(cantidad):
    tipo_envio_total = [0] * 7  # Para 7 tipos de envío
    forma_pago_total = [0, 0]  # 0: efectivo, 1: tarjeta de crédito

    for tipo in range(7):
        for forma in range(2):
            tipo_envio_total[tipo] += cantidad[tipo][forma]
            forma_pago_total[forma] += cantidad[tipo][forma]

    return tipo_envio_total, forma_pago_total


def calcular_importe(tipo_envio, codigo_postal, forma_pago):
    # precios segun el tipo de envio
    precios_nacionales = [1100, 1800, 2450, 8300, 10900, 14300, 17900]
    # recargos segun el pais
    paises = ["Brasil_89", "Brasil_4567", "Brasil_0123", "Chile", "Paraguay", "Bolivia", "Montevideo", "Uruguay",
              "Otros"]
    recargos = [0.20, 0.30, 0.25, 0.25, 0.20, 0.20, 0.20, 0.25, 0.50]
    # forma de pago
    if forma_pago == 1:
        descuento = float(0.1)
    else:
        descuento = 0

    pais = determinar_pais(codigo_postal)

    if pais == "Argentina":
        return precios_nacionales[int(tipo_envio)] - precios_nacionales[int(tipo_envio)] * descuento
    else:
        ind = 0
        for i in paises:
            if pais == i:
                precio = precios_nacionales[int(tipo_envio)] * (1 + recargos[ind])
                return precio - (precio * descuento)
            ind += 1


def sacar_promedio(fdb, linecont):
    arr = []
    impacum = 0
    mb = open(fdb, "rb")
    for i in range(linecont):
        r = pickle.load(mb)
        impacum += calcular_importe(r.tipenv, r.codpostal, r.formadepago)
    prom = impacum / linecont
    mb.seek(0)
    for i in range(linecont):
        r = pickle.load(mb)
        if calcular_importe(r.tipenv, r.codpostal, r.formadepago) > prom:
            arr.append(r)
    mb.close()

    sort(arr)
    for i in range(len(arr)):
        print(arr[i])
    print('-' * 65)
    print('Importe promedio pagado entre todos los envíos: ', prom)


def sort(arr):
    n = len(arr)
    h = 1
    while h <= n // 9:
        h = 3 * h + 1
    while h > 0:
        for j in range(h, n):
            y = arr[j].codpostal
            k = j - h
            while k >= 0 and y < arr[k].codpostal:
                arr[k + h].codpostal = arr[k].codpostal
                k -= h
            arr[k + h].codpostal = y
        h //= 3
    return arr


def menu():
    print("\nMenú de opciones:")
    print("1. Crear archivo binario a partir del archivo CSV.")
    print("2. Cargar un nuevo envío.")
    print("3. Mostrar todos los envíos.")
    print("4. Buscar envíos por código postal.")
    print("5. Buscar envío por dirección.")
    print("6. Mostrar cantidad de envíos por tipo de envío y forma de pago.")
    print("7. Totalizar envíos por tipo de envío y forma de pago.")
    print("8. Envíos con importe mayor al importe promedio pagado de todos los envíos.")
    print("0. Salir.")
