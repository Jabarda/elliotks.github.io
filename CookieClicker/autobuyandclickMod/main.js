/* 
Changelog
9/12/2021
Added checks for autobuy wait times to not exceed 30 seconds, or Infinant - this helps with buying queue issues.
Increased autobuy delay to 500ms, this seems to help in general. If you want to lower it, just search for 500 and replace it with whatever ms delay you want. 
Added support for autobuying "One mind" without getting stuck in a buy loop.
Fixed Click Frenzy, Frenzy buff checks - the old Game.clickFrenzy and Game.frenzy checks do not seem to work. Switched to using HasBuff('') to check
Changed where popup messages are positioned to resolve the issue of them being cluttered at the top of the screen and can't read the text.
Changed how Status is displayed. Press S to see a popup with current mod status options that are enabled/disabled. If there is an item in the autobuy queue, it will display what it is waiting for. 
Changed 'gold' autoclick function and removed the duplicate that was at the top of the script. This way turning off 'gold' (Keyboard Hotkey G) will not click Shimmers. 
Added ascendluck Z Keyboard Hotkey to turn on - this will automatically ascend you when your total Prestige/Ascend Meter end in 777777 to unlock Lucky Payout (if you don't already have it)

If you want to disable something from turning on by default; search for this line in this script (it's towards the bottom).
        [65, 72, 71, 70, 77].map(function (key) {
remove the numbers for the mapped keys, for example 65 is for autobuy (see Keyboard and Hotkeys below for other action #'s) 
so if you wanted to stop autobuy from being automatically enabled you would update the line to this
        [72, 71, 70, 77].map(function (key) {
save the file, restart the game, or unload/load the mod. 

Keyboard Hotkeys -
A 'autobuy' (65) - Toggle Autobuy On/Off
Z 'ascendluck' (90) - Calls Autobuy with 0 delay (Doesn't seem to do anything different)
H 'season' (72) - Toggle Season On/Off (Automatically switches season on popup?)
G 'gold' (71) - Toggle gold On/Off (Automatically clicks Shimmers Golden cookie, Reindeer, ect.)
F 'frenzy' (70) - Toggle frenzy On/Off (Automatically clicks BigCookie during frenzy)
M 'main'(77) - Toggle main On/Off (Automatically clicks BigCookie)
S 'status' (83) - Sends mod status information to the console window
P 'protect' (80) - Toggle protect On/Off (Calculates best building to buy protecting cookies needed for Lucky/Frenzy/ect.)

Credits - 
Lukyanov Dmitriy (Deamondz) (Github) - for the original script https://gist.github.com/deamondz/2372c8e48d9bcdc7bab4de956fa1e9b7
killerkonnat (Reddit) https://www.reddit.com/user/killerkonnat/ - for providing better "protect" math "12000" to "1200".
Elendarys (Reddit) https://www.reddit.com/user/Elendarys/ - for providing if(!isFinite(wait)) return; for autobuy. 
Which triggered an idea for limiting buying wait times to 30 seconds.
Reddit users for reporting bugs.
*/

Game.registerMod("Auto click and buy Mod", {
    init: function () {

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
                return Game.cookiesPs * (1 - Game.cpsSucked);
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
                    delay: 100,
                    func: this.guard.bind(this)
                },
                autobuy: {
                    delay: 500,
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
                        if (Game.hasBuff('Click Frenzy') != 0 > 0) Game.ClickCookie(0);
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
            for (var h in Game.shimmers) {
		if (Game.shimmers[h] !== undefined)
                Game.shimmers[h].pop();
            }
                        }
                    }
                },
		ascendluck: {
			delay: 50,
			func: function () {
			if ((Game.prestige + Game.ascendMeterLevel).toString().endsWith("777777") && !Game.HasUnlocked('Lucky payout')) {
			console.log("Total Prestige/Ascend Level ends in 777777");
			Game.Ascend(1);
			Game.ClosePrompt();
			}
}
},
            };

            this.toggle_action('guard');
        }

        Controller.prototype = {
            say: function (msg) {
                console.log(msg);
                Game.Popup(msg, Game.windowW / 2, Game.windowH - 100);
            },

            guard: function () {
                var t = this.total;
                this.total = 1000 * (Game.hasBuff('Frenzy') != 0 ? 1 : 0) + Game.BuildingsOwned + Game.UpgradesOwned;
                if (this.actions.timeouts.buy && (t != this.total || !this.actions.autobuy.id || this.target.price <= Game.cookies - this.calc.ecps()))
                    this.unqueue_action('buy');
            },

            autobuy: function () {
                if (this.actions.timeouts.buy || Game.hasBuff('Frenzy') != 0 > 0)
                    return;
                var info = this.calc.find_best(this.actions.main.id ? 1000 / this.actions.main.delay : 0);
                var protect = this.protect && Game.Has('Get lucky') != 0 ? (Game.hasBuff('Frenzy') != 0 ? 1 : 7) * Game.cookiesPs * 1200 : 0;
                var wait = (protect + info.price - Game.cookies) / this.calc.ecps();
                if (!isFinite(wait) || wait > 30)
                    return;
                var msg = (wait > 0 ? 'Waiting (' + Beautify(wait, 1) + ' s) for' : 'Buying') + ' "' + info.obj.name + '"';
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
                                this.say('Buying "' + info.obj.name + '"');
                                if (info.obj.name === "One mind") {
                                    Game.UpgradesById['69'].buy(1);
                                    Game.ClosePrompt();
                                    this.total++;
                                    this.unqueue_action('buy');
                                } else {
                                    info.obj.buy();
                                    this.total++;
                                }
                            }
                        }.bind(this)
                    );
                } else {
                    if (info.obj.name === "One mind") {
                        Game.UpgradesById['69'].buy(1);
                        Game.ClosePrompt();
                        this.total++;
                    } else {
                        info.obj.buy();
                        this.total++;
                    }
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
                this.say(msg);
            },

            toggle_protect: function () {
                this.protect = !this.protect;
                this.unqueue_action('buy');
                this.say('Action Protect turned ' + (this.protect ? 'on' : 'off'));
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
            ctrl: new Controller(),
            actions: {
                65 /* A */: 'autobuy',
                90 /* Z */: 'ascendluck',
                72 /* H */: 'season',
                71 /* G */: 'gold',
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