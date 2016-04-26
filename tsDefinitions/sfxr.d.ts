declare var sfxrMasterVolume:number;
declare class SfxrParams{
    //Wave Shape
    wave_type:number;
    
    // Envelope
    p_env_attack:number;
    p_env_sustain:number;
    p_env_punch:number;
    p_env_decay:number;
    
    // Tone
    p_base_freq:number;    // Start frequency
    p_freq_limit:number;   // Min frequency cutoff
    p_freq_ramp:number;    // Slide (SIGNED)
    p_freq_dramp:number;
    // Vibrato
    p_vib_strength:number;
    p_vib_speed:number;
    
    // Tonal change
    p_arp_mod:number;
    p_arp_speed:number;
    
    // Duty (wat's that?)
    p_duty:number;
    p_duty_ramp:number;
    
    // Repeat
    p_repeat_speed:number;
    
    // Phaser
    p_pha_offset:number;
    p_pha_ramp:number;
    
    // Low-pass filter
    p_lpf_freq:number;
    p_lpf_ramp:number;
    p_lpf_resonance:number;
    // High-pass filter
    p_hpf_freq:number;
    p_hpf_ramp:number;
    
    // Sample parameters
    sound_vol:number;
    sample_rate:number;
    sample_size:number;
    
    constructor();
}
declare function sfxrPlaySeed(seed:number);
declare function sfxrPickupCoin();
declare function sfxrLaserShoot();
declare function sfxrExplosion();
declare function sfxrBirdSound();
declare function sfxrPushSound();
declare function sfxrPowerUp();
declare function sfxrHitHurt();
declare function sfxrJump();
declare function sfxrBlipSelect();
declare function sfxrRandom();
declare function generateFromSeed(seed:SfxrParams);

