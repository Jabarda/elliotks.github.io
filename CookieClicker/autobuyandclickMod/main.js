/* 
Credits - 
Lukyanov Dmitriy (Deamondz) (Github) - for the original script https://gist.github.com/deamondz/2372c8e48d9bcdc7bab4de956fa1e9b7
killerkonnat (Reddit) https://www.reddit.com/user/killerkonnat/ - for providing better "protect" math "12000" to "1200".
Reddit users for reporting bugs.
Keyboard Hotkeys -
A 'autobuy' - Toggle Autobuy On/Off
Z 'oneshot' - Calls Autobuy with 0 delay (Doesn't seem to do anything different)
H 'season' - Toggle Season On/Off (Automatically switches season on popup?)
G 'gold' - Toggle gold On/Off (Automatically clicks Shimmers Golden cookie, Reindeer, ect.)
N 'gnotify' - Currently broken
F 'frenzy' - Toggle frenzy On/Off (Automatically clicks BigCookie during frenzy)
M 'main' - Toggle main On/Off (Automatically clicks BigCookie)
S 'status' - Sends mod status information to the console window
P 'protect' - Toggle protect On/Off (Calculates best building to buy protecting cookies needed for Lucky/Frenzy/ect.)
*/
Game.registerMod("Auto click and buy Mod", {
    init: function () {

        setInterval(function () {
            for (var h in Game.shimmers) {
                Game.shimmers[h].pop();
            }
        }, 1000);

        // --- Calculator
        function Calculator() {
            this.schema = [{
                    objects: function () {
                        return Game.UpgradesInStore.filter(function (e) {
                            return ([
                                // Filter to exclude Switches / Prestiege Items

                                // Toggle type = tech
                                /* data placeholder
                                65, // Specialized chocolate chips
                                66, // Designer cocoa beans
                                67, // Ritual rolling pins
                                68, // Underworld ovens
                                69, // One mind 
                                70, // Exotic nuts
                                71, // Communal brainsweep
                                72, // Arcane sugar
                                73, // Elder Pact 
                                */

                                // Toggle type = toggle
                                74, //Elder Pledge
                                84, // Elder Covenant
                                85, // Revoke Elder Covenant
                                87, // Sacrificial rolling pins ???
                                182, // Festive biscuit
                                183, // Ghostly biscuit
                                184, // Lovesick biscuit
                                185, // Fool's biscuit
                                209, // Bunny biscuit
                                331, // Golden switch [off]
                                332, // Golden switch [on]
                                333, // Milk selector
                                361, // Golden cookie sound selector
                                414, // Background selector
                                452, // Sugar frenzy
                                563, // Shimmering veil [off]
                                564, // Shimmering veil [on]

                                // Toggle type = prestige
                                141, // Persistent memory
                                181, // Season switcher
                                253, // Tin of british tea biscuits
                                254, // Box of macarons
                                255, // Box of brand biscuits
                                264, // Permanent upgrade slot I
                                265, // Permanent upgrade slot II
                                266, // Permanent upgrade slot III
                                267, // Permanent upgrade slot IV
                                268, // Permanent upgrade slot V
                                269, // Starspawn
                                270, // Starsnow
                                271, // Starterror
                                272, // Starlove
                                273, // Startrade
                                274, // Angels
                                275, // Archangels
                                276, // Virtues
                                277, // Dominions
                                278, // Cherubim
                                279, // Seraphim
                                280, // God
                                281, // Twin Gates of Transcendence
                                282, // Heavenly luck
                                283, // Lasting fortune
                                284, // Decisive fate
                                285, // Divine discount
                                286, // Divine sales
                                287, // Divine bakeries
                                288, // Starter kit
                                289, // Starter kitchen
                                290, // Halo gloves
                                291, // Kitten angels
                                292, // Unholy bait
                                293, // Sacrilegious corruption
                                323, // How to bake your dragon
                                325, // Chimera
                                326, // Tin of butter cookies
                                327, // Golden switch
                                328, // Classic dairy selection
                                329, // Fanciful dairy selection
                                353, // Belphegor
                                354, // Mammon
                                355, // Abaddon
                                356, // Satan
                                357, // Asmodeus
                                358, // Beelzebub
                                359, // Lucifer
                                360, // Golden cookie alert sound
                                362, // Basic wallpaper assortment
                                363, // Legacy
                                364, // Elder spice
                                365, // Residual luck
                                368, // Five-finger discount
                                393, // Synergies Vol. I
                                394, // Synergies Vol. II
                                395, // Heavenly cookies
                                396, // Wrinkly cookies
                                397, // Distilled essence of redoubled luck
                                408, // Stevia Caelestis
                                409, // Diabetica Daemonicus
                                410, // Sucralosia Inutilis
                                411, // Lucky digit
                                412, // Lucky number
                                413, // Lucky payout
                                449, // Sugar baking
                                450, // Sugar craving
                                451, // Sugar aging process
                                495, // Eye of the wrinkler
                                496, // Inspired checklist
                                505, // Label printer
                                520, // Heralds
                                537, // Keepsakes
                                539, // Sugar crystal cookies
                                540, // Box of maybe cookies
                                541, // Box of not cookies
                                542, // Box of pastries
                                561, // Genius accounting
                                562, // Shimmering veil
                                591, // Cosmic beginner's luck
                                592, // Reinforced membrane
                                643, // Fortune cookies
                                646, // Kitten wages
                                647, // Pet the dragon
                                717, // Cat ladies
                                718, // Milkhelp&reg; lactose intolerance relief tablets
                                719, // Aura gloves
                                720 // Luminous gloves
                            ].indexOf(e.id) < 0);
                        });
                    },
                    accessors: {
                        add: function (e) {
                            e.bought = 1;
                        },
                        sub: function (e) {
                            e.bought = 0;
                        },
                        price: function (e) {
                            return e.basePrice;
                        }
                    }
                },
                {
                    objects: function () {
                        return Game.ObjectsById;
                    },
                    accessors: {
                        add: function (e) {
                            e.amount++;
                        },
                        sub: function (e) {
                            e.amount--;
                        },
                        price: function (e) {
                            return e.price;
                        }
                    }
                }
            ];
        }

        Calculator.prototype = {
            cps_acc: function (base_cps, new_cps, price) {
                return (base_cps * base_cps) * (new_cps - base_cps) / (price * price);
            },
            ecps: function () {
                return Game.cookiesPs * (1 - Game.cpsSucked)
            },

            calc_bonus: function (item, list_generator, mouse_rate) {
                var func = Game.Win;
                Game.Win = function () {};

                var res = list_generator().map(function (e) {
                    var price = Math.round(this.item.price(e));
                    this.item.add(e);
                    Game.CalculateGains();
                    var cps = this.calc.ecps() + Game.computedMouseCps * this.rate;
                    this.item.sub(e);
                    Game.CalculateGains();
                    return {
                        obj: e,
                        price: price,
                        acc: this.calc.cps_acc(this.base_cps, cps, price)
                    };
                }.bind({
                    item: item,
                    calc: this,
                    rate: mouse_rate,
                    base_cps: (Game.cookiesPs ? this.ecps() : 0.001) + Game.computedMouseCps * mouse_rate,
                }));

                Game.Win = func;
                return res;
            },

            find_best: function (mouse_rate) {
                var pool = [];
                var zero_buy = Math.sqrt(Game.cookiesEarned * Game.cookiesPs);
                for (var i = 0; i < this.schema.length; i++)
                    pool = pool.concat(this.calc_bonus(this.schema[i].accessors, this.schema[i].objects, mouse_rate || 0));
                return pool.reduce(function (m, v) {
                    return m.acc == 0 && m.price < zero_buy ? m : (v.acc == 0 && v.price < zero_buy ? v : (m.acc < v.acc ? v : m));
                }, pool[0]);
            }
        };

        // --- Controller
        function Controller() {
            this.calc = new Calculator();
            this.notify = new Audio("https://gist.github.com/pernatiy/38bc231506b06fd85473/raw/beep-30.mp3"); //source: http://www.soundjay.com/button/beep-30b.mp3
            this.protect = true;
            this.target = {
                name: undefined,
                price: -1
            };
            this.total = -1;

            this.actions = {
                timeouts: {},

                guard: {
                    delay: 1000,
                    func: this.guard.bind(this)
                },
                autobuy: {
                    delay: 50,
                    func: this.autobuy.bind(this)
                },
                oneshot: {
                    delay: 0,
                    func: this.autobuy.bind(this)
                },
                status: {
                    delay: 0,
                    func: this.status.bind(this)
                },
                protect: {
                    delay: 0,
                    func: this.toggle_protect.bind(this)
                },

                main: {
                    delay: 50,
                    func: function () {
                        Game.ClickCookie(0);
                    }
                },
                frenzy: {
                    delay: 50,
                    func: function () {
                        if (Game.clickFrenzy > 0) Game.ClickCookie(0);
                    }
                },
                season: {
                    delay: 1000,
                    func: function () {
                        if (Game.seasonPopup && Game.seasonPopup.life > 0) Game.seasonPopup.click();
                    }
                },
                gold: {
                    delay: 1000,
                    func: function () {
                        if (Game.shimmers) {
                            var sha = Object.keys(Game.shimmers);

                            for (var i = 0; i < sha.length; i++) {
                                sha[i].l.click();
                            }
                        }
                    }
                },
                gnotify: {
                    delay: 1000,
                    func: function () {
                        if (Game.goldenCookie && Game.goldenCookie.life > 0 && Game.goldenCookie.wrath == 0) this.play();
                    }.bind(this.notify)
                },
            };

            this.toggle_action('guard');
        }

        Controller.prototype = {
            say: function (msg, news) {
                console.log(msg);
                if (news) {
                    Game.Ticker = msg;
                    Game.TickerAge = 10 * Game.fps;
                } else {
                    Game.Popup(msg);
                }
            },

            guard: function () {
                var t = this.total;
                this.total = 1000 * (Game.frenzy > 0) + Game.BuildingsOwned + Game.UpgradesOwned;
                if (this.actions.timeouts.buy && (t != this.total || !this.actions.autobuy.id || this.target.price <= Game.cookies - this.calc.ecps()))
                    this.unqueue_action('buy');
            },

            autobuy: function () {
                if (this.actions.timeouts.buy || Game.clickFrenzy > 0)
                    return;

                var info = this.calc.find_best(this.actions.main.id ? 1000 / this.actions.main.delay : 0);
                var protect = this.protect && Game.Has('Get lucky') ? (Game.frenzy ? 1 : 7) * Game.cookiesPs * 1200 : 0;
                var wait = (protect + info.price - Game.cookies) / this.calc.ecps();
                var msg = (wait > 0 ? 'Waiting (' + Beautify(wait, 1) + ' s) for' : 'Choosing') + ' "' + info.obj.name + '"';
                console.log("For {cps = " + Beautify(Game.cookiesPs, 1) + ", protect = " + Beautify(protect) + "} best candidate is", info);
                this.say(msg);
                if (wait > 0) {
                    this.target.name = info.obj.name;
                    this.target.price = protect + info.price;
                    this.queue_action(
                        'buy',
                        1000 * (Game.cookiesPs ? wait + 0.05 : 60),
                        function () {
                            if (info.price <= Game.cookies) {
                                this.say('Bought "' + info.obj.name + '"');
                                info.obj.buy();
                                this.total++;
                            }
                        }.bind(this)
                    );
                } else {
                    info.obj.buy();
                    this.total++;
                }
            },

            status: function () {
                var act = [];
                var b2s = function (b) {
                    return b ? 'on'.fontcolor('green') : 'off'.fontcolor('red');
                };
                for (var i in this.actions)
                    if (this.actions[i].delay && i != 'guard')
                        act.push(i + ': ' + b2s(this.actions[i].id));
                var msg = '<p>' + act.join(', ') + '</p>';
                msg += '<p>cookie protection for max frenzy/lucky combo: ' + b2s(this.protect) + '</p>';
                if (this.actions.timeouts.buy)
                    msg += '<p>waiting ' + Beautify((this.target.price - Game.cookies) / this.calc.ecps(), 1) + ' s for "' + this.target.name + '"</p>';
                this.say(msg, true);
            },

            toggle_protect: function () {
                this.protect = !this.protect;
                this.unqueue_action('buy');
            },

            toggle_action: function (name) {
                var action = this.actions[name];

                if (!action)
                    return;

                if (action.delay) {
                    action.id = action.id ? clearInterval(action.id) : setInterval(action.func, action.delay);
                    this.say('Action "' + name + '" turned ' + (action.id ? 'on' : 'off'));
                } else {
                    action.func();
                }
            },

            unqueue_action: function (name) {
                var to = this.actions.timeouts;
                if (to[name]) {
                    clearTimeout(to[name]);
                    delete to[name];
                }
            },

            queue_action: function (name, delay, func) {
                var to = this.actions.timeouts;
                this.unqueue_action(name);
                to[name] = setTimeout(function () {
                    func();
                    delete to[name];
                }, delay);
            },
        };

        var view = {
            ctrl: new Controller,
            actions: {
                65 /* A */: 'autobuy',
                90 /* Z */: 'oneshot',
                72 /* H */: 'season',
                71 /* G */: 'gold',
                78 /* N */: 'gnotify',
                70 /* F */: 'frenzy',
                77 /* M */: 'main',
                83 /* S */: 'status',
                80 /* P */: 'protect',
            },
        };

        document.addEventListener('keydown', function (e) {
            if (this.actions[e.keyCode]) this.ctrl.toggle_action(this.actions[e.keyCode]);
        }.bind(view));

        [65, 72, 71, 70, 77].map(function (key) {
            this.ctrl.toggle_action(this.actions[key]);
        }.bind(view));

    },
    save: function () {
        //use this to store persistent data associated with your mod
    },
    load: function (str) {
        //do stuff with the string data you saved previously
    },
});