var game;
var plataformas;
var jogador;
var cursores;
var estrelas;
var pontos = 0;
var placar;
var logo;
var bombas;
var gameOver = false;
var fim;

function preload() {
    this.load.image('fundo', 'assets/fundo.png');
    this.load.image('plataforma', 'assets/plataforma.png');
    this.load.image('estrela', 'assets/estrela.png');
    this.load.image('bomba', 'assets/bomba.png');
    this.load.spritesheet('minininha',
        'assets/minininha.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
};

function create () {
    // fundo
    this.add.image(400, 300, 'fundo');

    // plataformas
    plataformas = this.physics.add.staticGroup();
    plataformas.create(400, 200, 'plataforma').refreshBody();
    plataformas.create(600, 300, 'plataforma');
    plataformas.create(100, 500, 'plataforma');
    plataformas.create(380, 450, 'plataforma');
    plataformas.create(100, 584, 'plataforma');
    plataformas.create(300, 584, 'plataforma');
    plataformas.create(500, 584, 'plataforma');
    plataformas.create(700, 584, 'plataforma');

    // jogador
    jogador = this.physics.add.sprite(150, 150, 'minininha');
    jogador.setBounce(0.3);
    jogador.setCollideWorldBounds(true);

    this.anims.create({
        key: 'anda_para_esquerda',
        frames: this.anims.generateFrameNumbers('minininha', {
            start: 0,
            end: 3,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'anda_para_direita',
        frames: this.anims.generateFrameNumbers(
            'minininha', {
                start: 5,
                end: 8,
            },
        ),        
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'fica_parada',
        frames: [ { key: 'minininha', frame: 4 } ],
        frameRate: 20,
    });

    this.physics.add.collider(jogador, plataformas);

    // teclado
    cursores = this.input.keyboard.createCursorKeys();

    // estrelas
    estrelas = this.physics.add.group({
        key: 'estrela',
        repeat: 7,
        setXY: {
            x: 50,
            y: 0,
            stepX: 100,
        }
    });

    estrelas.children.iterate((estrela) => {
        estrela.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    });

    this.physics.add.collider(estrelas, plataformas);

    this.physics.add.overlap(jogador, estrelas, pegarEstrela, null, this);

    // placar
    placar = this.add.text(650, 16, 
        'estrelas = 0',
        {
            fontSize: '16px',
            fill: '#723146',
        }
    );

    // logo
    logo = this.add.text(10, 16, 
        'Minininha | Etec Adolpho Berezin',
        {
            fontSize: '24px',
            fill: '#723146',
        }
    );

    // fim
    fim = this.add.text(200, 325, 
        '',
        {
            fontSize: '72px',
            fill: '#723146',
        }
    );    

    // bombas
    bombas = this.physics.add.group();
    this.physics.add.collider(bombas, plataformas);
    this.physics.add.collider(bombas, jogador, morreu, null, this);
};

function update () {
    if (cursores.left.isDown) {
        jogador.setVelocityX(-160);
        jogador.anims.play('anda_para_esquerda', true);
    } else if (cursores.right.isDown) {
        jogador.setVelocityX(160);
        jogador.anims.play('anda_para_direita', true);
    } else {
        jogador.setVelocityX(0);
        jogador.anims.play('fica_parada');
    }

    if (cursores.up.isDown && jogador.body.touching.down) {
        jogador.setVelocityY(-350);
    }
};

function pegarEstrela(jogador, estrela) {
    estrela.disableBody(true, true);

    pontos += 1;
    placar.setText(`estrelas = ${pontos}`);

    if (estrelas.countActive(true) === 0) {
        estrelas.children.iterate((estrela) => {
            estrela.enableBody(true, estrela.x, 0, true, true);
        });

        var x;
        if (jogador.x < 400) {
            x = Phaser.Math.Between(400, 800);
        } else {
            x = Phaser.Math.Between(0, 400);
        }
    
        var bomba = bombas.create(x, 0, 'bomba');
        bomba.setBounce(1.01);
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function morreu() {
    this.physics.pause();
    jogador.setTint(0xff0000);
    jogador.anims.play('fica_parada');
    gameOver = true;
    fim.setText('GAME OVER!');
}

game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: {
        preload,
        create,
        update,
    },
});