cp = input("Ingrese el código postal del lugar de destino: ")
direccion = input("Dirección del lugar de destino: ")
tipo = int(input("Tipo de envío (id entre 0 y 6 - ver tabla 2 en el enunciado): "))
pago = int(input("Forma de pago (1: efectivo - 2: tarjeta): "))

cdigcp = len(cp)

if tipo == 0:
    inicial = 1100
elif tipo == 1:
    inicial = 1800
elif tipo == 2:
    inicial = 2450
elif tipo == 3:
    inicial = 8300
elif tipo == 4:
    inicial = 10900
elif tipo == 5:
    inicial = 14300
elif tipo == 6:
    inicial = 17900

# PROVINCIA
if cp[0] == "A":
    provincia = "Salta"
elif cp[0] == "B":
    provincia = "Provincia de Buenos Aires"
elif cp[0] == "C":
    provincia = "Ciudad Autónoma de Buenos Aires"
elif cp[0] == "D":
    provincia = "San Luis"
elif cp[0] == "E":
    provincia = "Entre Ríos"
elif cp[0] == "F":
    provincia = "La Rioja"
elif cp[0] == "G":
    provincia = "Santiago del Estero"
elif cp[0] == "H":
    provincia = "Chaco"
elif cp[0] == "J":
    provincia = "San Juan"
elif cp[0] == "K":
    provincia = "Catamarca"
elif cp[0] == "L":
    provincia = "La Pampa"
elif cp[0] == "M":
    provincia = "Mendoza"
elif cp[0] == "N":
    provincia = "Misiones"
elif cp[0] == "P":
    provincia = "Formosa"
elif cp[0] == "Q":
    provincia = "Neuquén"
elif cp[0] == "R":
    provincia = "Río Negro"
elif cp[0] == "S":
    provincia = "Santa Fe"
elif cp[0] == "T":
    provincia = "Tucuman"
elif cp[0] == "U":
    provincia = "Chubut"
elif cp[0] == "V":
    provincia = "Tierra del Fuego"
elif cp[0] == "W":
    provincia = "Corrientes"
elif cp[0] == "X":
    provincia = "Córdoba"
elif cp[0] == "Y":
    provincia = "Jujuy"
elif cp[0] == "Z":
    provincia = "Santa Cruz"
else:
    provincia = "No aplica"

if cdigcp == 8 and "A" <= cp[0] <= "Z" and cp[0] != "O" and cp[0] != "I" and "0" <= cp[1] <= "9" and "0" <= cp[2] <= "9" and "0" <= cp[3] <= "9" and "0" <= cp[4] <= "9" and "A" <= cp[5] <= "Z" and "A" <= cp[6] <= "Z" and "A" <= cp[7] <= "Z":
    destino = "Argentina"
    if pago == 1:
        final = int (inicial - (inicial * 10 / 100))
    elif pago == 2:
        final = inicial


elif cdigcp == 4 and "0" <= cp[0] <= "9" and "0" <= cp[1] <= "9" and "0" <= cp[2] <= "9" and "0" <= cp[3] <= "9":
    destino = "Bolivia"
    inicial = int (inicial + (inicial * 20 / 100))
    if pago == 1:
        final = int (inicial - (inicial * 10 / 100))
    elif pago == 2:
        final = inicial


elif cdigcp == 9 and "0" <= cp[0] <= "9" and "0" <= cp[1] <= "9" and "0" <= cp[2] <= "9" and "0" <= cp[3] <= "9" and "0" <= cp[4] <= "9" and cp[5] == "-" and "0" <= cp[6] <= "9" and "0" <= cp[7] <= "9" and "0" <= cp[8] <= "9":
    if cp[0] == 0 or cp[0] == 1 or cp[0] == 2 or cp[0] == 3:
        inicial = int (inicial + (inicial * 25 / 100))
        if pago == 1:
            final = int (inicial - (inicial * 10 / 100))
        elif pago == 2:
            final = inicial

    if cp[0] == 4 or cp[0] == 5 or cp[0] == 6 or cp[0] == 7:
        inicial = int (inicial + (inicial * 30 / 100))
        if pago == 1:
            final = int (inicial - (inicial * 10 / 100))
        elif pago == 2:
            final = inicial

    if cp[0] == 8 or cp[0] == 9:
        inicial = int (inicial + (inicial * 20 / 100))
        if pago == 1:
            final = int (inicial - (inicial * 10 / 100))
        elif pago == 2:
            final = inicial

    destino = "Brasil"

elif cdigcp == 7 and "0" <= cp[0] <= "9" and "0" <= cp[1] <= "9" and "0" <= cp[2] <= "9" and "0" <= cp[3] <= "9" and "0" <= cp[4] <= "9" and "0" <= cp[5] <= "9" and "0" <= cp[6] <= "9":
    destino = "Chile"
    inicial = int (inicial + (inicial * 25 / 100))
    if pago == 1:
        final = int (inicial - (inicial * 10 / 100))
    elif pago == 2:
        final = inicial


elif cdigcp == 6 and "0" <= cp[0] <= "9" and "0" <= cp[1] <= "9" and "0" <= cp[2] <= "9" and "0" <= cp[3] <= "9" and "0" <= cp[4] <= "9" and "0" <= cp[5] <= "9":
    destino = "Paraguay"
    inicial = int (inicial + (inicial * 20 / 100))
    if pago == 1:
        final = int (inicial - (inicial * 10 / 100))
    elif pago == 2:
        final = inicial


elif cdigcp == 5 and '0' <= cp[0] <= "9" and "0" <= cp[1] <= "9" and "0" <= cp[2] <= "9" and "0" <= cp[3] <= "9" and "0" <= cp[4] <= "9":
    if cp[0] == "1":
        destino = "Uruguay(Montevideo)"
        inicial = int (inicial + (inicial * 20 / 100))
        if pago == 1:
            final = int (inicial - (inicial * 10 / 100))
        elif pago == 2:
            final = inicial
    else:
        destino = "Uruguay"
        inicial = int (inicial + (inicial * 25 / 100))
        if pago == 1:
            final = int (inicial - (inicial * 10 / 100))
        elif pago == 2:
            final = inicial
else:
    destino = "Otro"
    inicial = int (inicial + (inicial * 50 / 100))
    if pago == 1:
        final = int (inicial - (inicial * 10 / 100))
    elif pago == 2:
        final = inicial


print("País de destino del envío:", destino)
print("Provincia destino:", provincia)
print("Importe inicial a pagar:", inicial)
print("Importe final a pagar:", final)
