((exports) => {
	// @TODO: DRY hotkey helpers
	// & defines accelerators (hotkeys) in menus and buttons and things, which get underlined in the UI.
	// & can be escaped by doubling it, e.g. "&Taskbar && Start Menu"
	function index_of_hotkey(text) {
		// Returns the index of the ampersand that defines a hotkey, or -1 if not present.

		// return english_text.search(/(?<!&)&(?!&|\s)/); // not enough browser support for negative lookbehind assertions

		// The space here handles beginning-of-string matching and counteracts the offset for the [^&] so it acts like a negative lookbehind
		return ` ${text}`.search(/[^&]&[^&\s]/);
	}
	function has_hotkey(text) {
		return index_of_hotkey(text) !== -1;
	}
	function remove_hotkey(text) {
		return text.replace(/\s?\(&.\)/, "").replace(/([^&]|^)&([^&\s])/, "$1$2");
	}
	function display_hotkey(text) {
		// misnomer: using .menu-hotkey out of laziness, instead of a more general term like .hotkey or .accelerator
		return `<span style="white-space: pre">${text.replace(/([^&]|^)&([^&\s])/, "$1<span class='menu-hotkey'>$2</span>").replace(/&&/g, "&")}</span>`;
	}
	function get_hotkey(text) {
		return text[index_of_hotkey(text) + 1].toUpperCase();
	}

	let localizations = {};
	function localize(english_text, ...interpolations) {
		function find_localization(english_text) {
			const amp_index = index_of_hotkey(english_text);
			if (amp_index > -1) {
				const without_hotkey = remove_hotkey(english_text);
				if (localizations[without_hotkey]) {
					const hotkey_def = english_text.slice(amp_index, amp_index + 2);
					if (localizations[without_hotkey].toUpperCase().indexOf(hotkey_def.toUpperCase()) > -1) {
						return localizations[without_hotkey];
					} else {
						if (has_hotkey(localizations[without_hotkey])) {
							// window.console && console.warn(`Localization has differing accelerator (hotkey) hint: '${localizations[without_hotkey]}' vs '${english_text}'`);
							// @TODO: detect differing accelerator more generally
							return `${remove_hotkey(localizations[without_hotkey])} (${hotkey_def})`;
						}
						return `${localizations[without_hotkey]} (${hotkey_def})`;
					}
				}
			}
			if (localizations[english_text]) {
				return localizations[english_text];
			}
			return english_text;
		}
		function interpolate(text, interpolations) {
			for (let i = 0; i < interpolations.length; i++) {
				text = text.replace(`%${i + 1}`, interpolations[i]);
			}
			return text;
		}
		return interpolate(find_localization(english_text), interpolations);
	}

	const language_storage_key = "jspaint language";
	const accepted_languages = Array.from(navigator.languages || [navigator.language || navigator.userLanguage]);
	try {
		if (localStorage[language_storage_key]) {
			accepted_languages.unshift(localStorage[language_storage_key]);
		}
	} catch (error) {
		// if there's no localStorage access, you can still configure the language via system settings, theoretically
		// TODO: also via URL?
	}

	var language_to_default_region = {
		aa: 'ET',
		ab: 'GE',
		abr: 'GH',
		ace: 'ID',
		ach: 'UG',
		ada: 'GH',
		ady: 'RU',
		ae: 'IR',
		aeb: 'TN',
		af: 'ZA',
		agq: 'CM',
		aho: 'IN',
		ak: 'GH',
		akk: 'IQ',
		aln: 'XK',
		alt: 'RU',
		am: 'ET',
		amo: 'NG',
		aoz: 'ID',
		apd: 'TG',
		ar: 'EG',
		arc: 'IR',
		'arc-Nbat': 'JO',
		'arc-Palm': 'SY',
		arn: 'CL',
		aro: 'BO',
		arq: 'DZ',
		ary: 'MA',
		arz: 'EG',
		as: 'IN',
		asa: 'TZ',
		ase: 'US',
		ast: 'ES',
		atj: 'CA',
		av: 'RU',
		awa: 'IN',
		ay: 'BO',
		az: 'AZ',
		'az-Arab': 'IR',
		ba: 'RU',
		bal: 'PK',
		ban: 'ID',
		bap: 'NP',
		bar: 'AT',
		bas: 'CM',
		bax: 'CM',
		bbc: 'ID',
		bbj: 'CM',
		bci: 'CI',
		be: 'BY',
		bej: 'SD',
		bem: 'ZM',
		bew: 'ID',
		bez: 'TZ',
		bfd: 'CM',
		bfq: 'IN',
		bft: 'PK',
		bfy: 'IN',
		bg: 'BG',
		bgc: 'IN',
		bgn: 'PK',
		bgx: 'TR',
		bhb: 'IN',
		bhi: 'IN',
		bhk: 'PH',
		bho: 'IN',
		bi: 'VU',
		bik: 'PH',
		bin: 'NG',
		bjj: 'IN',
		bjn: 'ID',
		bjt: 'SN',
		bkm: 'CM',
		bku: 'PH',
		blt: 'VN',
		bm: 'ML',
		bmq: 'ML',
		bn: 'BD',
		bo: 'CN',
		bpy: 'IN',
		bqi: 'IR',
		bqv: 'CI',
		br: 'FR',
		bra: 'IN',
		brh: 'PK',
		brx: 'IN',
		bs: 'BA',
		bsq: 'LR',
		bss: 'CM',
		bto: 'PH',
		btv: 'PK',
		bua: 'RU',
		buc: 'YT',
		bug: 'ID',
		bum: 'CM',
		bvb: 'GQ',
		byn: 'ER',
		byv: 'CM',
		bze: 'ML',
		ca: 'ES',
		cch: 'NG',
		ccp: 'BD',
		ce: 'RU',
		ceb: 'PH',
		cgg: 'UG',
		ch: 'GU',
		chk: 'FM',
		chm: 'RU',
		cho: 'US',
		chp: 'CA',
		chr: 'US',
		cja: 'KH',
		cjm: 'VN',
		ckb: 'IQ',
		co: 'FR',
		cop: 'EG',
		cps: 'PH',
		cr: 'CA',
		crh: 'UA',
		crj: 'CA',
		crk: 'CA',
		crl: 'CA',
		crm: 'CA',
		crs: 'SC',
		cs: 'CZ',
		csb: 'PL',
		csw: 'CA',
		ctd: 'MM',
		cu: 'RU',
		'cu-Glag': 'BG',
		cv: 'RU',
		cy: 'GB',
		da: 'DK',
		dak: 'US',
		dar: 'RU',
		dav: 'KE',
		dcc: 'IN',
		de: 'DE',
		den: 'CA',
		dgr: 'CA',
		dje: 'NE',
		dnj: 'CI',
		doi: 'IN',
		dsb: 'DE',
		dtm: 'ML',
		dtp: 'MY',
		dty: 'NP',
		dua: 'CM',
		dv: 'MV',
		dyo: 'SN',
		dyu: 'BF',
		dz: 'BT',
		ebu: 'KE',
		ee: 'GH',
		efi: 'NG',
		egl: 'IT',
		egy: 'EG',
		eky: 'MM',
		el: 'GR',
		en: 'US',
		'en-Shaw': 'GB',
		es: 'ES',
		esu: 'US',
		et: 'EE',
		ett: 'IT',
		eu: 'ES',
		ewo: 'CM',
		ext: 'ES',
		fa: 'IR',
		fan: 'GQ',
		ff: 'SN',
		'ff-Adlm': 'GN',
		ffm: 'ML',
		fi: 'FI',
		fia: 'SD',
		fil: 'PH',
		fit: 'SE',
		fj: 'FJ',
		fo: 'FO',
		fon: 'BJ',
		fr: 'FR',
		frc: 'US',
		frp: 'FR',
		frr: 'DE',
		frs: 'DE',
		fub: 'CM',
		fud: 'WF',
		fuf: 'GN',
		fuq: 'NE',
		fur: 'IT',
		fuv: 'NG',
		fvr: 'SD',
		fy: 'NL',
		ga: 'IE',
		gaa: 'GH',
		gag: 'MD',
		gan: 'CN',
		gay: 'ID',
		gbm: 'IN',
		gbz: 'IR',
		gcr: 'GF',
		gd: 'GB',
		gez: 'ET',
		ggn: 'NP',
		gil: 'KI',
		gjk: 'PK',
		gju: 'PK',
		gl: 'ES',
		glk: 'IR',
		gn: 'PY',
		gom: 'IN',
		gon: 'IN',
		gor: 'ID',
		gos: 'NL',
		got: 'UA',
		grc: 'CY',
		'grc-Linb': 'GR',
		grt: 'IN',
		gsw: 'CH',
		gu: 'IN',
		gub: 'BR',
		guc: 'CO',
		gur: 'GH',
		guz: 'KE',
		gv: 'IM',
		gvr: 'NP',
		gwi: 'CA',
		ha: 'NG',
		hak: 'CN',
		haw: 'US',
		haz: 'AF',
		he: 'IL',
		hi: 'IN',
		hif: 'FJ',
		hil: 'PH',
		hlu: 'TR',
		hmd: 'CN',
		hnd: 'PK',
		hne: 'IN',
		hnj: 'LA',
		hnn: 'PH',
		hno: 'PK',
		ho: 'PG',
		hoc: 'IN',
		hoj: 'IN',
		hr: 'HR',
		hsb: 'DE',
		hsn: 'CN',
		ht: 'HT',
		hu: 'HU',
		hy: 'AM',
		hz: 'NA',
		ia: 'FR',
		iba: 'MY',
		ibb: 'NG',
		id: 'ID',
		ife: 'TG',
		ig: 'NG',
		ii: 'CN',
		ik: 'US',
		ikt: 'CA',
		ilo: 'PH',
		in: 'ID',
		inh: 'RU',
		is: 'IS',
		it: 'IT',
		iu: 'CA',
		iw: 'IL',
		izh: 'RU',
		ja: 'JP',
		jam: 'JM',
		jgo: 'CM',
		ji: 'UA',
		jmc: 'TZ',
		jml: 'NP',
		jut: 'DK',
		jv: 'ID',
		jw: 'ID',
		ka: 'GE',
		kaa: 'UZ',
		kab: 'DZ',
		kac: 'MM',
		kaj: 'NG',
		kam: 'KE',
		kao: 'ML',
		kbd: 'RU',
		kby: 'NE',
		kcg: 'NG',
		kck: 'ZW',
		kde: 'TZ',
		kdh: 'TG',
		kdt: 'TH',
		kea: 'CV',
		ken: 'CM',
		kfo: 'CI',
		kfr: 'IN',
		kfy: 'IN',
		kg: 'CD',
		kge: 'ID',
		kgp: 'BR',
		kha: 'IN',
		khb: 'CN',
		khn: 'IN',
		khq: 'ML',
		kht: 'IN',
		khw: 'PK',
		ki: 'KE',
		kiu: 'TR',
		kj: 'NA',
		kjg: 'LA',
		kk: 'KZ',
		'kk-Arab': 'CN',
		kkj: 'CM',
		kl: 'GL',
		kln: 'KE',
		km: 'KH',
		kmb: 'AO',
		kn: 'IN',
		knf: 'SN',
		ko: 'KR',
		koi: 'RU',
		kok: 'IN',
		kos: 'FM',
		kpe: 'LR',
		krc: 'RU',
		kri: 'SL',
		krj: 'PH',
		krl: 'RU',
		kru: 'IN',
		ks: 'IN',
		ksb: 'TZ',
		ksf: 'CM',
		ksh: 'DE',
		ku: 'TR',
		'ku-Arab': 'IQ',
		kum: 'RU',
		kv: 'RU',
		kvr: 'ID',
		kvx: 'PK',
		kw: 'GB',
		kxm: 'TH',
		kxp: 'PK',
		ky: 'KG',
		'ky-Arab': 'CN',
		'ky-Latn': 'TR',
		la: 'VA',
		lab: 'GR',
		lad: 'IL',
		lag: 'TZ',
		lah: 'PK',
		laj: 'UG',
		lb: 'LU',
		lbe: 'RU',
		lbw: 'ID',
		lcp: 'CN',
		lep: 'IN',
		lez: 'RU',
		lg: 'UG',
		li: 'NL',
		lif: 'NP',
		'lif-Limb': 'IN',
		lij: 'IT',
		lis: 'CN',
		ljp: 'ID',
		lki: 'IR',
		lkt: 'US',
		lmn: 'IN',
		lmo: 'IT',
		ln: 'CD',
		lo: 'LA',
		lol: 'CD',
		loz: 'ZM',
		lrc: 'IR',
		lt: 'LT',
		ltg: 'LV',
		lu: 'CD',
		lua: 'CD',
		luo: 'KE',
		luy: 'KE',
		luz: 'IR',
		lv: 'LV',
		lwl: 'TH',
		lzh: 'CN',
		lzz: 'TR',
		mad: 'ID',
		maf: 'CM',
		mag: 'IN',
		mai: 'IN',
		mak: 'ID',
		man: 'GM',
		'man-Nkoo': 'GN',
		mas: 'KE',
		maz: 'MX',
		mdf: 'RU',
		mdh: 'PH',
		mdr: 'ID',
		men: 'SL',
		mer: 'KE',
		mfa: 'TH',
		mfe: 'MU',
		mg: 'MG',
		mgh: 'MZ',
		mgo: 'CM',
		mgp: 'NP',
		mgy: 'TZ',
		mh: 'MH',
		mi: 'NZ',
		min: 'ID',
		mis: 'IQ',
		mk: 'MK',
		ml: 'IN',
		mls: 'SD',
		mn: 'MN',
		'mn-Mong': 'CN',
		mni: 'IN',
		mnw: 'MM',
		moe: 'CA',
		moh: 'CA',
		mos: 'BF',
		mr: 'IN',
		mrd: 'NP',
		mrj: 'RU',
		mro: 'BD',
		ms: 'MY',
		mt: 'MT',
		mtr: 'IN',
		mua: 'CM',
		mus: 'US',
		mvy: 'PK',
		mwk: 'ML',
		mwr: 'IN',
		mwv: 'ID',
		mxc: 'ZW',
		my: 'MM',
		myv: 'RU',
		myx: 'UG',
		myz: 'IR',
		mzn: 'IR',
		na: 'NR',
		nan: 'CN',
		nap: 'IT',
		naq: 'NA',
		nb: 'NO',
		nch: 'MX',
		nd: 'ZW',
		ndc: 'MZ',
		nds: 'DE',
		ne: 'NP',
		new: 'NP',
		ng: 'NA',
		ngl: 'MZ',
		nhe: 'MX',
		nhw: 'MX',
		nij: 'ID',
		niu: 'NU',
		njo: 'IN',
		nl: 'NL',
		nmg: 'CM',
		nn: 'NO',
		nnh: 'CM',
		no: 'NO',
		nod: 'TH',
		noe: 'IN',
		non: 'SE',
		nqo: 'GN',
		nr: 'ZA',
		nsk: 'CA',
		nso: 'ZA',
		nus: 'SS',
		nv: 'US',
		nxq: 'CN',
		ny: 'MW',
		nym: 'TZ',
		nyn: 'UG',
		nzi: 'GH',
		oc: 'FR',
		om: 'ET',
		or: 'IN',
		os: 'GE',
		osa: 'US',
		otk: 'MN',
		pa: 'IN',
		'pa-Arab': 'PK',
		pag: 'PH',
		pal: 'IR',
		'pal-Phlp': 'CN',
		pam: 'PH',
		pap: 'AW',
		pau: 'PW',
		pcd: 'FR',
		pcm: 'NG',
		pdc: 'US',
		pdt: 'CA',
		peo: 'IR',
		pfl: 'DE',
		phn: 'LB',
		pka: 'IN',
		pko: 'KE',
		pl: 'PL',
		pms: 'IT',
		pnt: 'GR',
		pon: 'FM',
		pra: 'PK',
		prd: 'IR',
		ps: 'AF',
		pt: 'PT',//'BR',
		puu: 'GA',
		qu: 'PE',
		quc: 'GT',
		qug: 'EC',
		raj: 'IN',
		rcf: 'RE',
		rej: 'ID',
		rgn: 'IT',
		ria: 'IN',
		rif: 'MA',
		rjs: 'NP',
		rkt: 'BD',
		rm: 'CH',
		rmf: 'FI',
		rmo: 'CH',
		rmt: 'IR',
		rmu: 'SE',
		rn: 'BI',
		rng: 'MZ',
		ro: 'RO',
		rob: 'ID',
		rof: 'TZ',
		rtm: 'FJ',
		ru: 'RU',
		rue: 'UA',
		rug: 'SB',
		rw: 'RW',
		rwk: 'TZ',
		ryu: 'JP',
		sa: 'IN',
		saf: 'GH',
		sah: 'RU',
		saq: 'KE',
		sas: 'ID',
		sat: 'IN',
		sav: 'SN',
		saz: 'IN',
		sbp: 'TZ',
		sc: 'IT',
		sck: 'IN',
		scn: 'IT',
		sco: 'GB',
		scs: 'CA',
		sd: 'PK',
		'sd-Deva': 'IN',
		'sd-Khoj': 'IN',
		'sd-Sind': 'IN',
		sdc: 'IT',
		sdh: 'IR',
		se: 'NO',
		sef: 'CI',
		seh: 'MZ',
		sei: 'MX',
		ses: 'ML',
		sg: 'CF',
		sga: 'IE',
		sgs: 'LT',
		shi: 'MA',
		shn: 'MM',
		si: 'LK',
		sid: 'ET',
		sk: 'SK',
		skr: 'PK',
		sl: 'SI',
		sli: 'PL',
		sly: 'ID',
		sm: 'WS',
		sma: 'SE',
		smj: 'SE',
		smn: 'FI',
		smp: 'IL',
		sms: 'FI',
		sn: 'ZW',
		snk: 'ML',
		so: 'SO',
		sou: 'TH',
		sq: 'AL',
		sr: 'RS',
		srb: 'IN',
		srn: 'SR',
		srr: 'SN',
		srx: 'IN',
		ss: 'ZA',
		ssy: 'ER',
		st: 'ZA',
		stq: 'DE',
		su: 'ID',
		suk: 'TZ',
		sus: 'GN',
		sv: 'SE',
		sw: 'TZ',
		swb: 'YT',
		swc: 'CD',
		swg: 'DE',
		swv: 'IN',
		sxn: 'ID',
		syl: 'BD',
		syr: 'IQ',
		szl: 'PL',
		ta: 'IN',
		taj: 'NP',
		tbw: 'PH',
		tcy: 'IN',
		tdd: 'CN',
		tdg: 'NP',
		tdh: 'NP',
		te: 'IN',
		tem: 'SL',
		teo: 'UG',
		tet: 'TL',
		tg: 'TJ',
		'tg-Arab': 'PK',
		th: 'TH',
		thl: 'NP',
		thq: 'NP',
		thr: 'NP',
		ti: 'ET',
		tig: 'ER',
		tiv: 'NG',
		tk: 'TM',
		tkl: 'TK',
		tkr: 'AZ',
		tkt: 'NP',
		tl: 'PH',
		tly: 'AZ',
		tmh: 'NE',
		tn: 'ZA',
		to: 'TO',
		tog: 'MW',
		tpi: 'PG',
		tr: 'TR',
		tru: 'TR',
		trv: 'TW',
		ts: 'ZA',
		tsd: 'GR',
		tsf: 'NP',
		tsg: 'PH',
		tsj: 'BT',
		tt: 'RU',
		ttj: 'UG',
		tts: 'TH',
		ttt: 'AZ',
		tum: 'MW',
		tvl: 'TV',
		twq: 'NE',
		txg: 'CN',
		ty: 'PF',
		tyv: 'RU',
		tzm: 'MA',
		udm: 'RU',
		ug: 'CN',
		'ug-Cyrl': 'KZ',
		uga: 'SY',
		uk: 'UA',
		uli: 'FM',
		umb: 'AO',
		und: 'US',
		unr: 'IN',
		'unr-Deva': 'NP',
		unx: 'IN',
		ur: 'PK',
		uz: 'UZ',
		'uz-Arab': 'AF',
		vai: 'LR',
		ve: 'ZA',
		vec: 'IT',
		vep: 'RU',
		vi: 'VN',
		vic: 'SX',
		vls: 'BE',
		vmf: 'DE',
		vmw: 'MZ',
		vot: 'RU',
		vro: 'EE',
		vun: 'TZ',
		wa: 'BE',
		wae: 'CH',
		wal: 'ET',
		war: 'PH',
		wbp: 'AU',
		wbq: 'IN',
		wbr: 'IN',
		wls: 'WF',
		wni: 'KM',
		wo: 'SN',
		wtm: 'IN',
		wuu: 'CN',
		xav: 'BR',
		xcr: 'TR',
		xh: 'ZA',
		xlc: 'TR',
		xld: 'TR',
		xmf: 'GE',
		xmn: 'CN',
		xmr: 'SD',
		xna: 'SA',
		xnr: 'IN',
		xog: 'UG',
		xpr: 'IR',
		xsa: 'YE',
		xsr: 'NP',
		yao: 'MZ',
		yap: 'FM',
		yav: 'CM',
		ybb: 'CM',
		yo: 'NG',
		yrl: 'BR',
		yua: 'MX',
		yue: 'HK',
		'yue-Hans': 'CN',
		za: 'CN',
		zag: 'SD',
		zdj: 'KM',
		zea: 'NL',
		zgh: 'MA',
		zh: 'CN',
		'zh-Bopo': 'TW',
		'zh-Hanb': 'TW',
		'zh-Hant': 'TW',
		zlm: 'TG',
		zmi: 'MY',
		zu: 'ZA',
		zza: 'TR',
	};

	function get_language_emoji(locale) {
		return ""
	}

	const base_language = "en";
	const available_languages = ["en", "ru"];
	// spell-checker:disable
	const language_names = {
		en: [["English"], ["English"]],
		ru: [["Russian"], ["Русский"]]
	};
	// spell-checker:enable

	function get_iso_language_name(language) {
		return language_names[language][0][0];
	}
	function get_language_endonym(language) {
		return language_names[language][1][0];
	}

	let current_language = base_language;
	for (const accepted_language of accepted_languages) {
		if (available_languages.indexOf(accepted_language) !== -1) {
			current_language = accepted_language;
			break;
		}
	}

	function get_language() {
		return current_language;
	}
	function get_direction(language = current_language) {
		return language.match(/^(ar|dv|fa|ha|he|ks|ku|ms|pa|ps|sd|ug|yi)\b/i) ? "rtl" : "ltr";
	}
	function load_language(language) {
		// const prev_language = current_language;

		const stylesheets = [...document.querySelectorAll(".flippable-layout-stylesheet")];
		for (const stylesheet of stylesheets) {
			let href = stylesheet.getAttribute("href");
			if (get_direction(language) === "rtl") {
				if (href.indexOf(".rtl.css") === -1) {
					href = href.replace(/\.css$/i, ".rtl.css");
				}
			} else {
				if (href.indexOf(".rtl.css") > -1) {
					href = href.replace(/\.rtl\.css$/i, ".css");
				}
			}
			stylesheet.setAttribute("href", href);
			// hack to wait for stylesheet to load
			const img = document.createElement("img");
			img.onerror = () => {
				$(() => {
					$G.triggerHandler("theme-load"); // signal layout change
				});
			};
			img.src = href;
		}

		if (language === base_language) {
			localizations = {};
			current_language = base_language;
			return;
		}
		// fetch(`localization/${language}/localizations.json`)
		// .then((response)=> response.json())
		// .then((new_localizations)=> {
		// 	localizations = new_localizations;
		// 	current_language = language;
		// }).catch((error)=> {
		// 	show_error_message(`Failed to load localizations for ${language_names[language]}.`, error);
		// 	current_language = prev_language;
		// });
		const src = `localization/${language}/localizations.js`;
		document.write(`<script src="${src}"></${""/*(avoiding ending script tag if inlined in HTML)*/}script>`);
	}
	// JSONP callback in the localization files
	window.loaded_localizations = function loaded_localizations(language, mapping) {
		localizations = mapping;
		current_language = language;
	}
	function set_language(language) {
		showMessageBox({
			title: "Reload Required",
			message: "The application needs to reload to change the language.",
			buttons: [
				{ label: localize("OK"), value: "reload", default: true },
				{ label: localize("Cancel"), value: "cancel" },
			],
			windowOptions: {
				innerWidth: 450,
			},
		}).then((result) => {
			if (result === "reload") {
				are_you_sure(() => {
					try {
						localStorage[language_storage_key] = language;
						exit_fullscreen_if_ios();
						location.reload();
					} catch (error) {
						show_error_message("Failed to store language preference. Make sure cookies / local storage is enabled in your browser settings.", error);
					}
				});
			}
		});
	}
	load_language(current_language);

	exports.localize = localize;
	exports.set_language = set_language;
	exports.get_language = get_language;
	exports.get_iso_language_name = get_iso_language_name;
	exports.get_language_endonym = get_language_endonym;
	exports.get_language_emoji = get_language_emoji;
	exports.get_direction = get_direction;
	exports.available_languages = available_languages;

	// @TODO: these should come from os-gui.js (new AccessKeys API)
	exports.remove_hotkey = remove_hotkey;
	exports.display_hotkey = display_hotkey;
	exports.get_hotkey = get_hotkey;

})(window);