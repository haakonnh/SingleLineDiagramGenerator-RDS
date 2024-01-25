from matplotlib import pyplot as plt


x, y = [], []

for i in range( 100 ):
    y.append(i)
    x.append(i)

    plt.xlim(0, 100)
    plt.ylim(0, 100)

    plt.plot(x, y, color = "green")
    plt.pause(0.01)

plt.show()


